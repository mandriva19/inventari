import { useEffect, useRef } from 'react';

/**
 * useInfiniteScroll — fires `onLoadMore` when the sentinel element enters the viewport.
 *
 * @param {() => void} onLoadMore - callback to load next page
 * @param {boolean}    hasMore    - whether more items exist
 * @param {boolean}    isLoading  - prevents duplicate calls
 * @returns {React.RefObject} - attach to a sentinel div at the bottom of your list
 */
export function useInfiniteScroll(onLoadMore, hasMore, isLoading) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [onLoadMore, hasMore, isLoading]);

  return sentinelRef;
}
