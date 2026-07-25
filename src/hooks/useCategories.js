import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured, QUERY_CATEGORIES } from '../lib/sanity.js';
import { CATEGORIES as MOCK_CATEGORIES } from '../lib/mockData.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (isSanityConfigured) {
      sanityClient
        .fetch(QUERY_CATEGORIES)
        .then((data) => {
          if (!cancelled) {
            // Map title to label to match mockData structure for easy transition
            const mappedCategories = data.map((cat) => ({
              ...cat,
              label: cat.title,
            }));
            setCategories(mappedCategories);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.error('[Sanity] fetch categories error:', err);
            setIsLoading(false);
          }
        });
    } else {
      // Fallback to mock data
      setCategories(MOCK_CATEGORIES);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading };
}
