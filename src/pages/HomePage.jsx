import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/catalog/FilterBar';
import ProductGrid from '../components/catalog/ProductGrid';
import { useProducts } from '../hooks/useProducts';

export default function HomePage({ isScrolled }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeStatus = searchParams.get('status');

  const filters = {
    category: activeCategory,
    status:   activeStatus,
    search:   '',
  };

  const { products, hasMore, loadMore, isLoading, total } = useProducts(filters);

  const setActiveCategory = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const setActiveStatus = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status) {
      newParams.set('status', status);
    } else {
      newParams.delete('status');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('status');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

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
