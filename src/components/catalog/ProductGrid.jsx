import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

// Skeleton card placeholder
function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 shadow-sm animate-pulse" aria-hidden="true">
      <div className="w-full aspect-[4/3] bg-gray-200" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-11/12 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-0.5 p-0.5 bg-gray-200 mt-auto">
        <div className="flex-1 h-12 bg-gray-300" />
        <div className="flex-1 h-12 bg-gray-300" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, hasMore, loadMore, isLoading, total, filters, onClearFilters }) {
  const { t } = useTranslation();
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  const hasActiveFilters = filters.category || filters.status || filters.search;

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4" role="status">
        <div className="text-6xl mb-4" aria-hidden="true">📦</div>
        <p className="text-xl font-semibold text-gray-900 mb-2">
          {t('home.no_results')}
        </p>
        <p className="text-gray-500 mb-6 max-w-md">
          {t('home.no_results_hint')}
        </p>
        {hasActiveFilters && (
          <button 
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors" 
            onClick={onClearFilters} 
            id="clear-filters-btn"
          >
            {t('home.clear_filters')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[600px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:gap-6"
        role="list"
        aria-label="Products"
        aria-live="polite"
        aria-atomic="false"
      >
        {products.map((product) => (
          <div key={product._id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
        {/* Skeleton cards while loading next page */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {/* Spinner for subsequent loads */}
      {isLoading && products.length > 0 && (
        <div className="flex justify-center py-8" role="status" aria-label="Loading more products">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* End of results message */}
      {!hasMore && !isLoading && products.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-8">
          {t('home.items_found', { count: total })}
        </p>
      )}
    </div>
  );
}
