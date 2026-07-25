import { useState, useEffect } from 'react';
import {
  sanityClient,
  isSanityConfigured,
  buildProductBySlugQuery,
  buildSimilarProductsQuery,
  QUERY_CATEGORIES,
} from '../lib/sanity.js';
import { MOCK_PRODUCTS, CATEGORIES } from '../lib/mockData.js';

/**
 * useProduct — fetches a single product by slug.
 *
 * Falls back to mock data if Sanity is not configured.
 *
 * @param {string} slug
 * @returns {{ product, isLoading, error }}
 */
export function useProduct(slug) {
  const [product,   setProduct]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    if (isSanityConfigured) {
      sanityClient
        .fetch(buildProductBySlugQuery(), { slug })
        .then((data) => {
          if (cancelled) return;
          setProduct(data || null);
          setIsLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('[Sanity] product fetch error:', err);
          setError(err);
          setIsLoading(false);
        });
    } else {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
      setProduct(found);
      setIsLoading(false);
    }

    return () => { cancelled = true; };
  }, [slug]);

  return { product, isLoading, error };
}

/**
 * useSimilarProducts — fetches products from the same category.
 *
 * @param {{ categoryId: string, excludeSlug: string, limit?: number }}
 * @returns {{ products, isLoading }}
 */
export function useSimilarProducts({ categoryId, excludeSlug, limit = 4 }) {
  const [products,  setProducts]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setIsLoading(true);

    if (isSanityConfigured) {
      sanityClient
        .fetch(buildSimilarProductsQuery(), {
          categoryId,
          slug:  excludeSlug,
          limit,
        })
        .then((data) => {
          if (cancelled) return;
          setProducts(data || []);
          setIsLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setIsLoading(false);
        });
    } else {
      const similar = MOCK_PRODUCTS
        .filter((p) => p.categoryId === categoryId && p.slug !== excludeSlug)
        .slice(0, limit);
      setProducts(similar);
      setIsLoading(false);
    }

    return () => { cancelled = true; };
  }, [categoryId, excludeSlug, limit]);

  return { products, isLoading };
}

/**
 * useCategories — fetches all categories.
 *
 * Falls back to CATEGORIES mock if Sanity not configured.
 *
 * @returns {{ categories, isLoading }}
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (isSanityConfigured) {
      sanityClient
        .fetch(QUERY_CATEGORIES)
        .then((data) => {
          if (cancelled) return;
          setCategories(data || []);
          setIsLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setCategories(CATEGORIES);
          setIsLoading(false);
        });
    } else {
      setCategories(CATEGORIES);
      setIsLoading(false);
    }

    return () => { cancelled = true; };
  }, []);

  return { categories, isLoading };
}
