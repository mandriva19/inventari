import { localizedString, localizedText } from './localized.js';
import { category } from './category.js';
import { product }  from './product.js';
import { siteSettings } from './siteSettings.js';

export const schemaTypes = [
  // Reusable types (must be registered before they are used)
  localizedString,
  localizedText,
  // Documents
  category,
  product,
  siteSettings,
];
