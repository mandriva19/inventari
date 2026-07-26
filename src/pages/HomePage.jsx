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
    </>
  );
}
