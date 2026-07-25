import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured, buildProductBySlugQuery } from '../lib/sanity.js';
import { MOCK_PRODUCTS } from '../lib/mockData.js';

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (isSanityConfigured) {
      sanityClient
        .fetch(buildProductBySlugQuery(), { slug })
        .then((data) => {
          if (!cancelled) {
            setProduct(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.error('[Sanity] fetch product error:', err);
            setIsLoading(false);
          }
        });
    } else {
      const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
      setProduct(mockProduct || null);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, isLoading };
}
