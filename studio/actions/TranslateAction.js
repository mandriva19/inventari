import { useState, useEffect } from 'react';
import { useDocumentOperation } from 'sanity';

// Free Google Translate API
async function translateText(text, sourceLang, targetLang) {
  if (!text) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return '';
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (error) {
    console.error(`Translation error from ${sourceLang} to ${targetLang}:`, error);
    return '';
  }
}

function findLocalizedFields(obj, path = '') {
  let fields = [];
  if (obj === null || typeof obj !== 'object') return fields;

  // Check if this object represents a localized field (has en or ka key)
  if (('en' in obj && typeof obj.en === 'string') || ('ka' in obj && typeof obj.ka === 'string')) {
    fields.push({ path, value: obj });
    return fields;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('_') && key !== '_key') continue; // Skip internal fields
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      fields = fields.concat(findLocalizedFields(value, currentPath));
    }
  }
  return fields;
}

export function TranslateAction(props) {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [isTranslating, setIsTranslating] = useState(false);

  const doc = props.draft || props.published;
  if (!doc || !['product', 'category', 'siteStrings', 'siteSettings'].includes(props.type)) {
    return null;
  }

  // Define target languages we support
  const LANGUAGES = ['en', 'ka', 'ru', 'tr', 'ar'];

  return {
    label: isTranslating ? 'Translating...' : 'Auto-Translate',
    disabled: isTranslating,
    onHandle: async () => {
      setIsTranslating(true);

      try {
        const patchData = {};
        const localizedFields = findLocalizedFields(doc);

        for (const field of localizedFields) {
          const fieldObj = field.value;
          // Determine source language
          let sourceLang = null;
          let sourceText = '';

          if (fieldObj.en) {
            sourceLang = 'en';
            sourceText = fieldObj.en;
          } else if (fieldObj.ka) {
            sourceLang = 'ka';
            sourceText = fieldObj.ka;
          }

          if (!sourceLang || !sourceText) continue;

          // Translate to other missing languages
          for (const lang of LANGUAGES) {
            if (lang !== sourceLang && !fieldObj[lang]) {
              const translated = await translateText(sourceText, sourceLang, lang);
              if (translated) {
                patchData[`${field.path}.${lang}`] = translated;
              }
            }
          }
        }

        if (Object.keys(patchData).length > 0) {
          patch.execute([{ set: patchData }]);
          alert('Translations completed successfully!');
        } else {
          alert('No new translations were needed.');
        }
      } catch (error) {
        console.error('Translation action failed:', error);
        alert('Translation failed. Please try again.');
      } finally {
        setIsTranslating(false);
      }
    },
  };
}
