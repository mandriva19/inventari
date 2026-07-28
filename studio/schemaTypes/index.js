import { localizedString, localizedText } from './localized.js';
import { category } from './category.js';
import { product }  from './product.js';
import { siteSettings } from './siteSettings.js';
import { siteStrings } from './siteStrings.js';
import { contactChannel } from './contactChannel.js';
import { contactOption } from './contactOption.js';

export const schemaTypes = [
  // Reusable types (must be registered before they are used)
  localizedString,
  localizedText,
  contactChannel,
  contactOption,
  // Documents
  category,
  product,
  siteSettings,
  siteStrings,
];
