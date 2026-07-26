import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getContactForLang } from '../../config/contact';
import { useContactModal } from '../../contexts/ContactModalContext';
import { useSettings } from '../../contexts/SettingsContext';

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
  const settings = useSettings();

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Mini-Bar: Languages */}
      <div className="bg-gray-50 border-b border-gray-200 h-8 flex items-center justify-start transition-all duration-300">
        <div className="flex items-center gap-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-start" role="navigation" aria-label="Language switcher">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              id={`lang-btn-${l.code}`}
              className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded transition-colors ${
                lang === l.code 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => handleLangChange(l.code)}
              aria-label={`Switch to ${l.name}`}
              aria-pressed={lang === l.code}
              title={l.name}
            >
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bar: Logo & CTA */}
      <div className={`bg-white border-gray-200 transition-all duration-300 flex items-center overflow-hidden ${isScrolled ? 'h-0 border-b-0 opacity-0' : 'h-24 border-b opacity-100'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo (Left) */}
            <div className="flex items-center shrink-0">
              <Link to="/" aria-label={t('navigation.home') || 'Home'}>
                <img 
                  src={settings?.logoUrl || "/assets/logo.png"} 
                  alt="Inventari Logo" 
                  className="object-contain bg-white h-20 max-w-[300px]"
                />
              </Link>
            </div>

            {/* Contact CTA (Right) */}
            <div className="flex items-center justify-end">
              <button
                id="topbar-contact"
                onClick={() => openContactModal()}
                className="group flex items-center gap-2 px-6 py-3 bg-[#3665f3] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer whitespace-nowrap"
                aria-label={t('topbar.contact')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
                <span>{t('topbar.contact')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
