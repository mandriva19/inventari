/**
 * contact.js — Contact configuration
 *
 * Two groups (A / B) keyed by language.
 * Update phone numbers and chat links here whenever ready.
 * The UI reads this file — no component changes needed.
 */

export const CONTACT_GROUPS = {
  A: {
    label: 'GE / RU',
    languages: ['en', 'ka'],
    phone: '+99532XXXXXXX',
    phoneDisplay: '+995 32 XXX XXXX (1)',
    whatsapp: 'https://wa.me/99532XXXXXXX',
    telegram: '',
  },
  B: {
    label: 'GE / RU',
    languages: ['ru', 'tr', 'ar'],
    phone: '+99532XXXXXXX',
    phoneDisplay: '+995 32 XXX XXXX (2)',
    whatsapp: 'https://wa.me/99532XXXXXXX',
    telegram: '',
  },
};

/**
 * Returns the contact group object for a given language code.
 * Falls back to group A.
 *
 * @param {string} lang - e.g. 'en', 'ru', 'ar'
 * @returns {{ phone: string, phoneDisplay: string, whatsapp: string, telegram: string }}
 */
export function getContactForLang(lang) {
  for (const group of Object.values(CONTACT_GROUPS)) {
    if (group.languages.includes(lang)) return group;
  }
  return CONTACT_GROUPS.A;
}
