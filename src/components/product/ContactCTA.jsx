import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { useContactModal } from '../../contexts/ContactModalContext';

export default function ContactCTA({ productId, productTitle, size = 'md' }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const { openContactModal } = useContactModal();

  // Create a pseudo product object if we want to pass context to the modal
  const product = productId ? { _id: productId, title: productTitle } : null;

  // Uniform CTA classes for both sizes: uppercase, large padding, small border radius, simple hover
  const baseClass = "flex-1 flex items-center justify-center gap-3 bg-[#3665f3] hover:bg-[#2b51c2] text-white font-bold uppercase tracking-wider transition-colors rounded-md shadow-sm w-full cursor-pointer";
  const paddingClass = size === 'lg' ? "py-5 px-6 text-base" : "py-4 px-4 text-sm";

  return (
    <div className={`flex bg-gray-200 ${size === 'lg' ? 'mt-4' : ''}`}>
      <button
        onClick={() => openContactModal(product)}
        className={`${baseClass} ${paddingClass} m-1`}
        aria-label={t('product.call')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
        </svg>
        {t('product.call')}
      </button>
    </div>
  );
}
