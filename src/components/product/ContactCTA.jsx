import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { useContactModal } from '../../contexts/ContactModalContext';

export default function ContactCTA({ productId, productTitle, size = 'md' }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const { openContactModal } = useContactModal();

  // Create a pseudo product object if we want to pass context to the modal
  const product = productId ? { _id: productId, title: productTitle } : null;

  // Uniform CTA classes for both sizes: uppercase, large padding, simple hover
  const baseClass = "group w-full flex items-center justify-center gap-3 bg-[#3665f3] text-white font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer";
  const paddingClass = size === 'lg' ? "py-5 px-6 text-base" : "py-4 px-4 text-sm";

  return (
    <div className={`w-full ${size === 'lg' ? 'mt-4' : ''}`}>
      <button
        onClick={() => openContactModal(product)}
        className={`${baseClass} ${paddingClass}`}
        aria-label={t('product.contact_cta')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
        </svg>
        {t('product.contact_cta')}
      </button>
    </div>
  );
}
