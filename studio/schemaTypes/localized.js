/**
 * Sanity schema — localizedText
 * Reusable object for a text field in all 5 supported languages.
 * Used for: title, description, location, category labels.
 */
export const localizedString = {
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    { name: 'en', title: 'English',  type: 'string' },
    { name: 'ka', title: 'Georgian', type: 'string' },
    { name: 'ru', title: 'Russian',  type: 'string' },
    { name: 'tr', title: 'Turkish',  type: 'string' },
    { name: 'ar', title: 'Arabic',   type: 'string' },
  ],
};

export const localizedText = {
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    { name: 'en', title: 'English',  type: 'text', rows: 4 },
    { name: 'ka', title: 'Georgian', type: 'text', rows: 4 },
    { name: 'ru', title: 'Russian',  type: 'text', rows: 4 },
    { name: 'tr', title: 'Turkish',  type: 'text', rows: 4 },
    { name: 'ar', title: 'Arabic',   type: 'text', rows: 4 },
  ],
};
