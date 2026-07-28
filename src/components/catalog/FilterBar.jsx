import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '../../hooks/useLocalizedField';
import { useCategories } from '../../hooks/useCategories';

const STATUS_FILTERS = ['available', 'limited'];

export default function FilterBar({ activeCategory, activeStatus, onCategoryChange, onStatusChange, isScrolled }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const { categories } = useCategories();

  return (
    <div
      className={`sticky z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'top-16 py-2' : 'top-40 py-3'
      }`}
      role="navigation"
      aria-label="Product filters"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 -mb-1 hide-scrollbar">
          {/* Category chips */}
          <div className="flex items-center gap-2" role="group" aria-label="Category filter">
            <button
              id="filter-category-all"
              className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors font-medium ${
                !activeCategory 
                  ? 'bg-[#3665f3] text-white border-[#3665f3]' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onCategoryChange(null)}
              aria-pressed={!activeCategory}
            >
              {t('filters.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors font-medium ${
                  activeCategory === cat.id 
                    ? 'bg-[#3665f3] text-white border-[#3665f3]' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onCategoryChange(activeCategory === cat.id ? null : cat.id)}
                aria-pressed={activeCategory === cat.id}
              >
                {localize(cat.label)}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 shrink-0 mx-1" aria-hidden="true" />

          {/* Status chips */}
          <div className="flex items-center gap-2" role="group" aria-label="Availability filter">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                id={`filter-status-${status}`}
                className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors font-medium ${
                  activeStatus === status 
                    ? 'bg-[#3665f3] text-white border-[#3665f3]' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onStatusChange(activeStatus === status ? null : status)}
                aria-pressed={activeStatus === status}
              >
                {t(`filters.${status}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
