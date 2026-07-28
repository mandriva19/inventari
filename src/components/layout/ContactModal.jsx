import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContactModal } from '../../contexts/ContactModalContext';
import { CONTACT_GROUPS } from '../../config/contact';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { useSettings } from '../../contexts/SettingsContext';

const CHANNEL_META = {
  phone: {
    color: 'bg-[#3665f3] hover:bg-[#2b51c2]',
    label: 'Call',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    )
  },
  whatsapp: {
    color: 'bg-[#25D366] hover:bg-[#1ebd5a]',
    label: 'WhatsApp',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    )
  },
  telegram: {
    color: 'bg-[#0088cc] hover:bg-[#0077b5]',
    label: 'Telegram',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.393c-.16.16-.295.293-.605.293l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.873 4.327-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.196 1.006.128.837.953z"/>
      </svg>
    )
  },
  messenger: {
    color: 'bg-[#0084FF] hover:bg-[#0072db]',
    label: 'Messenger',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.448 5.518 3.7 7.202.195.145.31.374.312.62l.004 1.862c.002.502.52.836.986.608l2.098-1.025a.89.89 0 01.554-.06c.742.205 1.52.316 2.346.316 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.096 11.83l-2.025-2.158-3.95 2.158 4.343-4.606 2.077 2.157 3.897-2.157-4.342 4.606z"/>
      </svg>
    )
  },
  instagram: {
    color: 'bg-[#E1306C] hover:bg-[#c9245c]',
    label: 'Instagram',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845a1.44 1.44 0 100-2.881 1.44 1.44 0 000 2.881z"/>
      </svg>
    )
  },
  viber: {
    color: 'bg-[#7360F2] hover:bg-[#5c4bc4]',
    label: 'Viber',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.727 16.5c-.328.784-1.218 1.432-1.921 1.579-.623.131-1.391.139-2.025-.09-1.637-.591-3.232-1.637-4.469-2.875-1.238-1.238-2.284-2.833-2.875-4.47-.229-.634-.221-1.402-.09-2.025.147-.703.795-1.593 1.579-1.921.439-.184.872-.258 1.305-.184.343.059.589.28.795.589.261.391.758 1.258.916 1.579.139.284.158.558-.04.795-.213.254-.424.425-.668.694-.213.239-.44.522-.195.94.492.836 1.261 1.63 2.096 2.465.835.835 1.629 1.604 2.465 2.096.418.245.701.018.94-.195.269-.244.44-.455.694-.668.237-.198.511-.179.795-.04.321.158 1.188.655 1.579.916.309.206.53.452.589.795.074.433 0 .866-.184 1.305z"/>
      </svg>
    )
  },
  signal: {
    color: 'bg-[#3A76F0] hover:bg-[#2c5ebd]',
    label: 'Signal',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.082 17.587c-.63.26-1.328.093-1.748-.445-.4-.512-.397-1.229.006-1.737.404-.509 1.096-.682 1.699-.434.602.247.962.862.863 1.488-.1 0-.198.053-.298.083-1.077.324-1.077.324.478 1.045zm7.391-7.234c-.116 2.062-1.365 3.829-3.235 4.572-1.871.743-4.043.27-5.428-1.182-1.385-1.452-1.735-3.66-.874-5.492.861-1.832 2.766-2.906 4.793-2.698 2.45.251 4.316 2.378 4.316 4.845v-.045zm1.691-.045c0-3.414-2.585-6.353-5.992-6.698-3.407-.345-6.61 1.761-7.619 5.031-1.009 3.27.464 6.828 3.528 8.441 3.064 1.613 6.94.757 9.034-2.039 1.341-1.79 2.049-3.992 2.049-6.735z"/>
      </svg>
    )
  },
  sms: {
    color: 'bg-[#4F46E5] hover:bg-[#4338ca]',
    label: 'SMS',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
      </svg>
    )
  },
  email: {
    color: 'bg-[#EA4335] hover:bg-[#d13629]',
    label: 'Email',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    )
  },
  wechat: {
    color: 'bg-[#09B83E] hover:bg-[#079933]',
    label: 'WeChat',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.2 13c-2.3 0-4.2-1.5-4.2-3.4 0-1.9 1.9-3.4 4.2-3.4 2.3 0 4.2 1.5 4.2 3.4 0 1.9-1.9 3.4-4.2 3.4zm7.8 4.2c-1.9 0-3.4-1.2-3.4-2.8 0-1.6 1.5-2.8 3.4-2.8s3.4 1.2 3.4 2.8c0 1.6-1.5 2.8-3.4 2.8zm8-7.7c0-5.2-5.4-9.5-12-9.5S0 4.3 0 9.5c0 3.2 2.1 6.1 5.3 7.8-.2.6-.6 2.2-.7 2.5 0 .1.1.1.2.1 1 .5 2.7 1.2 3.6 1-.2-.4-.3-1-.2-1.6.8.2 1.7.3 2.6.3 6.6 0 12-4.3 12-9.5zm-5 5.5s.1 1 .2 1.3c0 .1-.1 0-.1 0-.7-.2-2.1-.8-2.8-.7.1.4.1.8.1 1.2-.6-.2-1.3-.3-2-.3-4.8 0-8.8-3-8.8-6.8 0-3.8 4-6.8 8.8-6.8s8.8 3 8.8 6.8c0 2.2-1.4 4.1-3.6 5.3z"/>
      </svg>
    )
  }
};

const getChannelLink = (type, value, productContext, localize) => {
  const cleanVal = value ? value.replace(/[\s\(\)\-\+]/g, '') : '';
  const chatMsg = productContext 
    ? encodeURIComponent(`Hi, I'm interested in: ${localize(productContext.title)} (ID: ${productContext.customId || productContext._id})`)
    : encodeURIComponent(`Hi, I have a question.`);

  switch (type) {
    case 'phone':
      return `tel:${cleanVal}`;
    case 'whatsapp':
      return `https://wa.me/${cleanVal}?text=${chatMsg}`;
    case 'telegram':
      return `https://t.me/${value.replace('@', '')}`;
    case 'messenger':
      return `https://m.me/${value.replace(/^\/+/, '')}`;
    case 'instagram':
      return `https://instagram.com/${value.replace('@', '')}`;
    case 'viber':
      return `viber://chat?number=${cleanVal}`;
    case 'signal':
      return `https://signal.me/#p/${cleanVal}`;
    case 'sms':
      return `sms:${cleanVal}?body=${chatMsg}`;
    case 'email':
      return `mailto:${value}?subject=Product%20Inquiry&body=${chatMsg}`;
    case 'wechat':
      return '#'; // Handled via clipboard copy
    default:
      return value;
  }
};

export default function ContactModal() {
  const { isOpen, closeContactModal, productContext } = useContactModal();
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const settings = useSettings();
  const [copiedText, setCopiedText] = useState(null);

  if (!isOpen) return null;

  // WeChat copy mechanism
  const handleWeChatCopy = (val) => {
    navigator.clipboard.writeText(val);
    setCopiedText(val);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Resolve options: Sanity array settings or static config fallback
  const resolvedGroups = settings?.contactOptions?.length > 0 
    ? settings.contactOptions.map((opt, index) => ({
        id: opt._key || `sanity-opt-${index}`,
        label: localize(opt.label),
        channels: opt.channels || []
      }))
    : Object.entries(CONTACT_GROUPS).map(([key, group], idx) => {
        // Build fallback using static values & custom global fields if any
        const phone = idx === 0 ? (settings?.phone1 || group.phone) : (settings?.phone2 || group.phone);
        const channels = [];
        if (phone) {
          channels.push({ type: 'phone', value: phone });
          channels.push({ type: 'whatsapp', value: phone });
        }
        return {
          id: key,
          label: group.label,
          channels
        };
      });

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
                {t('product.reference', { defaultValue: 'Product Reference' })}
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
            {resolvedGroups.map((group, idx) => (
              <div key={group.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#3665f3] text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">
                    {group.label}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {group.channels.map((chan, cIdx) => {
                    const meta = CHANNEL_META[chan.type] || CHANNEL_META['phone'];
                    const link = getChannelLink(chan.type, chan.value, productContext, localize);
                    const isWeChat = chan.type === 'wechat';

                    if (isWeChat) {
                      return (
                        <button
                          key={cIdx}
                          onClick={() => handleWeChatCopy(chan.value)}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-2 ${meta.color} text-white px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors min-h-[48px]`}
                        >
                          <div className="flex items-center gap-1.5">
                            {meta.icon}
                            <span>{copiedText === chan.value ? 'Copied!' : meta.label}</span>
                          </div>
                          {copiedText !== chan.value && (
                            <span className="text-[9px] lowercase opacity-80 block truncate max-w-full">
                              ({chan.value})
                            </span>
                          )}
                        </button>
                      );
                    }

                    return (
                      <a
                        key={cIdx}
                        href={link}
                        target={chan.type !== 'phone' && chan.type !== 'viber' && chan.type !== 'sms' ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 ${meta.color} text-white px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors min-h-[48px]`}
                      >
                        {meta.icon}
                        <span>{t(`product.${chan.type}`, { defaultValue: meta.label })}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
