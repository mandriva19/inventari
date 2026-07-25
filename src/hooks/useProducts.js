import { useState, useEffect, useRef, useCallback } from 'react';
import {
  sanityClient,
  isSanityConfigured,
  buildProductsQuery,
} from '../lib/sanity.js';
import { MOCK_PRODUCTS } from '../lib/mockData.js';

const PAGE_SIZE = 12;

/**
 * useProducts — manages filtered + paginated product list with infinite scroll.
 *
 * When VITE_SANITY_PROJECT_ID is configured → fetches from Sanity via GROQ.
 * Otherwise → falls back to local mock data so dev works without credentials.
 *
 * @param {{ category: string|null, status: string|null, search: string }} filters
 * @returns {{ products, hasMore, loadMore, isLoading, total }}
 */
export function useProducts(filters) {
  const [page, setPage]           = useState(1);
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const prevFilters               = useRef(null);

  // ── Reset pagination when filters change ──────────────────────────────────
  useEffect(() => {
    const key = JSON.stringify(filters);
    if (prevFilters.current !== key) {
      prevFilters.current = key;
      setPage(1);
      setProducts([]);
      setTotal(0);
    }
  }, [filters]);

  // ── Fetch / compute products ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (isSanityConfigured) {
      // ── Live Sanity fetch ──────────────────────────────────────────────────
      const offset = (page - 1) * PAGE_SIZE;
      const query  = buildProductsQuery({
        category: filters.category || undefined,
        status:   filters.status   || undefined,
        offset,
        limit: PAGE_SIZE,
      });
      const params = {
        category: filters.category || null,
        status:   filters.status   || null,
      };

      sanityClient
        .fetch(query, params)
        .then(({ items, total: t }) => {
          if (cancelled) return;
          setProducts((prev) => (page === 1 ? items : [...prev, ...items]));
          setTotal(t);
          setIsLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('[Sanity] fetch error:', err);
          setIsLoading(false);
        });
    } else {
      // ── Mock data fallback ─────────────────────────────────────────────────
      const timer = setTimeout(() => {
        if (cancelled) return;

        const filtered = MOCK_PRODUCTS.filter((p) => {
          if (filters.category && p.categoryId !== filters.category) return false;
          if (filters.status   && p.status     !== filters.status)   return false;
          if (filters.search) {
            const q   = filters.search.toLowerCase();
            const hit = Object.values(p.title || {}).some((v) =>
              v.toLowerCase().includes(q)
            );
            if (!hit) return false;
          }
          return true;
        });

        const slice = filtered.slice(0, page * PAGE_SIZE);
        setProducts(slice);
        setTotal(filtered.length);
        setIsLoading(false);
      }, 280);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.category, filters.status, filters.search]);

  const hasMore = products.length < total;

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) setPage((p) => p + 1);
  }, [isLoading, hasMore]);

  return { products, hasMore, loadMore, isLoading, total };
}
