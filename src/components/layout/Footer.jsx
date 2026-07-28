import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getContactForLang } from '../../config/contact';
import { useSettings } from '../../contexts/SettingsContext';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const contact = getContactForLang(lang);
  const settings = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200 py-12 mt-16" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left gap-6">
        <Link to="/" aria-label="Go to homepage">
          <img src="/assets/logo.png" alt="Inventari Logo" className="h-20 w-auto object-contain" />
        </Link>
        <p className="text-gray-500 max-w-md">{t('footer.tagline')}</p>
        
        <div className="text-sm text-gray-400 mt-4">
          © 2026 | <a href="mailto:catalog@safeweb.ge?subject=Hello" className="hover:underline hover:text-gray-600">app@safeweb.ge</a>
        </div>
      </div>
    </footer>
  );
}
