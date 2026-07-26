import { useState, useCallback } from 'react';
import FilterBar from '../components/catalog/FilterBar';
import ProductGrid from '../components/catalog/ProductGrid';
import { useProducts } from '../hooks/useProducts';

export default function HomePage({ isScrolled }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeStatus, setActiveStatus]     = useState(null);

  const filters = {
    category: activeCategory,
    status:   activeStatus,
    search:   '',
  };

  const { products, hasMore, loadMore, isLoading, total } = useProducts(filters);

  const handleClearFilters = useCallback(() => {
    setActiveCategory(null);
    setActiveStatus(null);
  }, []);

  return (
    <>
      {/* Filters */}
      <FilterBar
        activeCategory={activeCategory}
        activeStatus={activeStatus}
        onCategoryChange={setActiveCategory}
        onStatusChange={setActiveStatus}
        isScrolled={isScrolled}
      />

      {/* Main content */}
      <main id="main-content" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product grid */}
        <ProductGrid
          products={products}
          hasMore={hasMore}
          loadMore={loadMore}
          isLoading={isLoading}
          total={total}
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      </main>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#3665f3] text-white rounded-full shadow-lg hover:bg-[#2b51c2] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      )}
    </>
  );
}
