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

export function TranslateAction(props) {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [isTranslating, setIsTranslating] = useState(false);

  const doc = props.draft || props.published;
  if (!doc || !['product', 'category'].includes(props.type)) {
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

        // Helper to translate a field
        const processField = async (fieldName) => {
          const fieldObj = doc[fieldName] || {};
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

          if (!sourceLang || !sourceText) return;

          // Translate to other missing languages
          for (const lang of LANGUAGES) {
            if (lang !== sourceLang && !fieldObj[lang]) {
              const translated = await translateText(sourceText, sourceLang, lang);
              if (translated) {
                patchData[`${fieldName}.${lang}`] = translated;
              }
            }
          }
        };

        // Translate title
        await processField('title');
        // Translate description
        await processField('description');
        // Translate location
        await processField('location');

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
