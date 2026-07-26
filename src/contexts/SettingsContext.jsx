import { createContext, useContext, useState, useEffect } from 'react';
import { sanityClient, urlFor } from '../lib/sanity';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    logoUrl: null,
    phone1: null,
    phone2: null,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
        if (data) {
          setSettings({
            logoUrl: data.logo ? urlFor(data.logo).url() : null,
            phone1: data.phone1 || null,
            phone2: data.phone2 || null,
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
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
