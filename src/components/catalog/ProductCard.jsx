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

  const category = CATEGORIES.find((c) => c.id === product.categoryId);

  const chatMsg = encodeURIComponent(
    `Hi, I'm interested in: ${localize(product.title)} (ID: ${product._id})`
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
            ID: {product._id?.substring(0, 8) || product._id}
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

      {/* CTA Buttons - Sexy Purple */}
      <div className="flex flex-col sm:flex-row gap-px bg-gray-200">
        <button
          id={`card-call-${product._id}`}
          onClick={(e) => { e.preventDefault(); openContactModal(product); }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#3665f3] hover:bg-[#2b51c2] text-white px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
          aria-label={`${t('product.call')} — ${localize(product.title)}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          {t('product.call')}
        </button>

        <button
          id={`card-chat-${product._id}`}
          onClick={(e) => { e.preventDefault(); openContactModal(product); }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#3665f3] hover:bg-[#2b51c2] text-white px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
          aria-label={`${t('product.chat')} — ${localize(product.title)}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {t('product.chat')}
        </button>
      </div>
    </article>
  );
}
