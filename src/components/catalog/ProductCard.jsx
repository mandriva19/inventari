import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { getContactForLang } from '../../config/contact';
import { CATEGORIES } from '../../lib/mockData';
import { useContactModal } from '../../contexts/ContactModalContext';

// Single category color
const CATEGORY_COLOR = 'bg-gray-100 text-gray-800';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedField();
  const lang = i18n.language;
  const contact = getContactForLang(lang);
  const { openContactModal } = useContactModal();

  const category = product.category || CATEGORIES.find((c) => c.id === product.categoryId);

  const chatMsg = encodeURIComponent(
    `Hi, I'm interested in: ${localize(product.title)} (ID: ${product.customId || product._id})`
  );
  const whatsappLink = contact.whatsapp
    ? `${contact.whatsapp}?text=${chatMsg}`
    : null;

  // Determine stock badge
  const qty = typeof product.quantity === 'number' ? product.quantity : parseInt(product.quantity, 10);
  let stockBadge = null;
  if (!isNaN(qty)) {
    if (qty < 3) {
      stockBadge = { label: t('product.lowStock', { defaultValue: 'Low Stock' }), className: 'bg-red-100 text-red-800 border border-red-200' };
    } else if (qty >= 3 && qty < 10) {
      stockBadge = { label: t('product.inStock', { defaultValue: 'In Stock' }), className: 'bg-green-100 text-green-800 border border-green-200' };
    } else if (qty >= 10) {
      stockBadge = { label: t('product.inStock', { defaultValue: 'In Stock' }), className: 'bg-green-600 text-white shadow-sm' };
    }
  }

  return (
    <article 
      className="flex flex-col h-full bg-white border border-gray-200 shadow-sm transition-shadow hover:shadow-md rounded-lg overflow-hidden group" 
      aria-label={localize(product.title)}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} tabIndex="-1" aria-hidden="true" className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={localize(product.title)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        
        {/* Dynamic Stock Badge Only */}
        {stockBadge && (
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${stockBadge.className}`}>
              {stockBadge.label}
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          {category && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLOR}`}>
              {localize(category.label)}
            </span>
          )}
          <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded shrink-0 font-medium">
            ID: {product.customId || product._id?.substring(0, 8) || product._id}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} className="hover:text-[#3665f3] transition-colors">
          <h2 className="text-lg font-bold text-gray-900 leading-tight mb-3">
            {localize(product.title)}
          </h2>
        </Link>

        {/* Meta row - pushed to bottom of content area */}
        <div className="mt-auto flex flex-col gap-1.5 pt-3 border-t border-gray-100">
          {product.quantity && (
            <span className="text-xs text-gray-500">
              {t('product.quantity')}: <strong className="text-gray-700">{product.quantity}</strong>
            </span>
          )}
          {product.location && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {localize(product.location)}
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full">
        <button
          id={`card-contact-${product._id}`}
          onClick={(e) => { e.preventDefault(); openContactModal(product); }}
          className="group w-full flex items-center justify-center gap-2 bg-[#3665f3] text-white px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-none"
          aria-label={`${t('product.contact_cta')} — ${localize(product.title)}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
          </svg>
          {t('product.contact_cta')}
        </button>
      </div>
    </article>
  );
}
