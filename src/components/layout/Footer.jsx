import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getContactForLang } from '../../config/contact';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const contact = getContactForLang(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200 py-12 lg:py-16 mt-16" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 w-fit" aria-label="Go to homepage">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded font-bold text-xl" aria-hidden="true">I</div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Inven<span className="text-blue-600">tari</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm">{t('footer.tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">{t('footer.quick_links')}</p>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">{t('footer.contact')}</p>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`tel:${contact.phone}`} className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="text-gray-500">{t('footer.location')}</span>
              </li>
              {contact.whatsapp && (
                <li>
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                    WhatsApp
                  </a>
                </li>
              )}
              {contact.telegram && (
                <li>
                  <a href={contact.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">
                    Telegram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© {year} Inventari. {t('footer.all_rights')}</span>
          <span>{t('footer.location')}</span>
        </div>
      </div>
    </footer>
  );
}
