import { createContext, useContext, useState, useEffect } from 'react';
import { sanityClient, urlFor } from '../lib/sanity';
import i18n from 'i18next';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    logoUrl: null,
    faviconUrl: null,
    phone1: null,
    phone2: null,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch both siteSettings and siteStrings
        const [settingsData, stringsData] = await Promise.all([
          sanityClient.fetch(`*[_type == "siteSettings"][0]`),
          sanityClient.fetch(`*[_type == "siteStrings"][0]`),
        ]);

        if (settingsData) {
          const logoUrl = settingsData.logo ? urlFor(settingsData.logo).url() : null;
          const faviconUrl = settingsData.favicon ? urlFor(settingsData.favicon).url() : null;

          setSettings({
            logoUrl,
            faviconUrl,
            phone1: settingsData.phone1 || null,
            phone2: settingsData.phone2 || null,
          });

          // Inject favicon dynamically
          if (faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = faviconUrl;
          }
        }

        // Handle dynamic translations
        if (stringsData && stringsData.useDynamicStrings) {
          const LANGUAGES = ['en', 'ka', 'ru', 'tr', 'ar'];

          LANGUAGES.forEach((lang) => {
            const bundle = {};

            Object.entries(stringsData).forEach(([sanityKey, localizedObj]) => {
              if (sanityKey.includes('__') && localizedObj && localizedObj[lang]) {
                const parts = sanityKey.split('__');
                let current = bundle;
                
                for (let i = 0; i < parts.length - 1; i++) {
                  const part = parts[i];
                  if (!current[part]) current[part] = {};
                  current = current[part];
                }
                
                current[parts[parts.length - 1]] = localizedObj[lang];
              }
            });

            if (Object.keys(bundle).length > 0) {
              // Deep merge into i18next translation namespace
              i18n.addResourceBundle(lang, 'translation', bundle, true, true);
            }
          });

          // Force i18n to refresh the current translations
          i18n.changeLanguage(i18n.language);
        }
      } catch (error) {
        console.error('Error fetching site settings/strings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
