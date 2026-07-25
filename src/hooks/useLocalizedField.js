import { useTranslation } from 'react-i18next';

/**
 * useLocalizedField — returns the value of a multilingual field object
 * for the currently active language, with English as fallback.
 *
 * Usage:
 *   const localize = useLocalizedField();
 *   localize(product.title) // → "Wooden Restaurant Chair" (in EN)
 */
export function useLocalizedField() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return function localize(field) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['en'] || Object.values(field)[0] || '';
  };
}
