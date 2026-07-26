import { useTranslation } from 'react-i18next';
import { useContactModal } from '../../contexts/ContactModalContext';
import { CONTACT_GROUPS } from '../../config/contact';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { useSettings } from '../../contexts/SettingsContext';

export default function ContactModal() {
  const { isOpen, closeContactModal, productContext } = useContactModal();
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const settings = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeContactModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="relative bg-white w-full max-w-md shadow-2xl rounded-xl flex flex-col max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 id="contact-modal-title" className="text-lg font-bold uppercase tracking-wider text-gray-900">
            {t('topbar.contact', { defaultValue: 'Contact Us' })}
          </h2>
          <button 
            onClick={closeContactModal}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {productContext && (
            <div className="bg-gray-50 p-4 border border-gray-100 flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Product Reference
              </span>
              <span className="font-mono text-sm font-bold text-gray-900">
                ID: {productContext.customId || productContext._id}
              </span>
              <span className="text-sm text-gray-600 line-clamp-1">
                {localize(productContext.title)}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {Object.entries(CONTACT_GROUPS).map(([key, group], idx) => {
              
              // Override static numbers with Sanity settings if available
              const overridePhone = idx === 0 ? (settings?.phone1 || group.phone) : (settings?.phone2 || group.phone);
              const overrideWhatsappUrl = idx === 0 && settings?.phone1 
                ? `https://wa.me/${settings.phone1.replace(/\D/g, '')}`
                : idx === 1 && settings?.phone2 
                  ? `https://wa.me/${settings.phone2.replace(/\D/g, '')}`
                  : group.whatsapp;
              
              const chatMsg = productContext 
                ? encodeURIComponent(`Hi, I'm interested in: ${localize(productContext.title)} (ID: ${productContext.customId || productContext._id})`)
                : encodeURIComponent(`Hi, I have a question.`);
              
              const whatsappLink = overrideWhatsappUrl ? `${overrideWhatsappUrl}?text=${chatMsg}` : null;

              return (
                <div key={key} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#3665f3] text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">
                      For {group.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${overridePhone}`}
                      className="flex items-center justify-center gap-2 bg-[#3665f3] hover:bg-[#2b51c2] text-white px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      {t('product.call', { defaultValue: 'Call' })}
                    </a>

                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        {t('product.chat', { defaultValue: 'Chat' })}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
