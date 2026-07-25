import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured, buildSimilarProductsQuery, buildProductsQuery } from '../lib/sanity.js';
import { MOCK_PRODUCTS } from '../lib/mockData.js';

export function useSimilarProducts(categoryId, slug, limit = 4) {
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (isSanityConfigured) {
      sanityClient
        .fetch(buildSimilarProductsQuery(), { categoryId, slug, limit })
        .then((data) => {
          if (cancelled) return;
          if (data.length < limit) {
            // Need to pad with other products
            const remaining = limit - data.length;
            sanityClient
              .fetch(`*[_type == "product" && category->slug.current != $categoryId && slug.current != $slug] | order(_createdAt desc) [0...$remaining] {
                _id,
                "slug": slug.current,
                title,
                status,
                condition,
                quantity,
                location,
                "categoryId": category->slug.current,
                "category": category->{ "id": slug.current, "label": title },
                "images": images[].asset->url
              }`, { categoryId, slug, remaining })
              .then((padData) => {
                if (!cancelled) {
                  setSimilar([...data, ...padData]);
                  setIsLoading(false);
                }
              });
          } else {
            setSimilar(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.error('[Sanity] fetch similar products error:', err);
            setIsLoading(false);
          }
        });
    } else {
      const similarByCategory = MOCK_PRODUCTS.filter(
        (p) => p.categoryId === categoryId && p.slug !== slug
      );
      let sim = similarByCategory.slice(0, limit);

      if (sim.length < limit) {
        const remainingCount = limit - sim.length;
        const paddingProducts = MOCK_PRODUCTS.filter(
          (p) => p.categoryId !== categoryId && p.slug !== slug
        ).slice(0, remainingCount);
        sim = [...sim, ...paddingProducts];
      }
      setSimilar(sim);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [categoryId, slug, limit]);

  return { similar, isLoading };
}
