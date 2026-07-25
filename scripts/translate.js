import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, VITE_SANITY_TOKEN } = process.env;

if (!VITE_SANITY_PROJECT_ID || !VITE_SANITY_TOKEN) {
  console.error('❌ Missing Sanity config or token in .env');
  console.error('Please configure VITE_SANITY_PROJECT_ID and VITE_SANITY_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: VITE_SANITY_PROJECT_ID,
  dataset: VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: VITE_SANITY_TOKEN,
  useCdn: false,
});

// Configure your LibreTranslate instance URL here
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000/translate';

const LANGUAGES_TO_TRANSLATE = ['ka', 'ru', 'tr', 'ar'];

/**
 * Helper to translate text using LibreTranslate.
 */
async function translateText(text, targetLang) {
  try {
    const res = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`Translation failed for ${targetLang}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error(`Translation error for ${targetLang}:`, err.message);
    return null;
  }
}

/**
 * Recursively find all localized fields (objects with 'en', 'ka', etc.) in a document.
 * Returns an array of paths that need translation.
 */
function findLocalizedFields(doc, path = '') {
  let fields = [];
  
  if (doc === null || typeof doc !== 'object') {
    return fields;
  }

  // Check if it's a localized object (has 'en' key)
  if ('en' in doc && typeof doc.en === 'string') {
    fields.push({ path, value: doc });
  }

  for (const [key, value] of Object.entries(doc)) {
    if (key === '_createdAt' || key === '_updatedAt' || key === '_rev' || key === '_type' || key === '_id') {
      continue;
    }
    const currentPath = path ? `${path}.${key}` : key;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        fields = fields.concat(findLocalizedFields(item, `${currentPath}[${index}]`));
      });
    } else if (typeof value === 'object') {
      // Don't recurse into the languages of a localized object
      if (!('en' in value && typeof value.en === 'string')) {
        fields = fields.concat(findLocalizedFields(value, currentPath));
      } else {
        fields.push({ path: currentPath, value });
      }
    }
  }

  return fields;
}

async function main() {
  console.log('🔍 Fetching documents from Sanity...');
  const docs = await client.fetch(`*[_type in ["product", "category"]]`);
  
  console.log(`Found ${docs.length} documents. Checking for missing translations...`);

  let translatedCount = 0;

  for (const doc of docs) {
    const localizedFields = findLocalizedFields(doc);
    let patches = {};

    for (const field of localizedFields) {
      const enText = field.value.en;
      if (!enText) continue;

      for (const targetLang of LANGUAGES_TO_TRANSLATE) {
        if (!field.value[targetLang]) {
          console.log(`Translating: [${doc._type}: ${doc._id}] ${field.path} -> ${targetLang}`);
          const translated = await translateText(enText, targetLang);
          
          if (translated) {
            patches[`${field.path}.${targetLang}`] = translated;
            translatedCount++;
          }
        }
      }
    }

    if (Object.keys(patches).length > 0) {
      console.log(`💾 Patching document ${doc._id}...`);
      await client.patch(doc._id).set(patches).commit();
      console.log(`✅ Document ${doc._id} updated.`);
    }
  }

  console.log(`🎉 Translation complete! Translated ${translatedCount} new fields.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
