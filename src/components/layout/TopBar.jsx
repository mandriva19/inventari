import { useTranslation } from 'react-i18next';
import { getContactForLang } from '../../config/contact';
import { useContactModal } from '../../contexts/ContactModalContext';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ka', label: 'GE', name: 'Georgian' },
  { code: 'ru', label: 'RU', name: 'Russian' },
  { code: 'tr', label: 'TR', name: 'Turkish' },
  { code: 'ar', label: 'AR', name: 'Arabic' },
];

export default function TopBar({ isScrolled }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const contact = getContactForLang(lang);
  const { openContactModal } = useContactModal();

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 flex items-center ${isScrolled ? 'h-8' : 'h-11'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Language switcher */}
          <div className="flex items-center gap-2" role="navigation" aria-label="Language switcher">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                id={`lang-btn-${l.code}`}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                  lang === l.code 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => handleLangChange(l.code)}
                aria-label={`Switch to ${l.name}`}
                aria-pressed={lang === l.code}
                title={l.name}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Contact CTA */}
          <button
            id="topbar-contact"
            onClick={() => openContactModal()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3665f3] hover:bg-[#2b51c2] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
            aria-label={t('topbar.contact')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span className="hidden sm:inline">{t('topbar.contact')}</span>
            <span className="sm:hidden">{t('product.call')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
