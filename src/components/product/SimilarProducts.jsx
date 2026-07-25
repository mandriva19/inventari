import { useTranslation } from 'react-i18next';
import ProductCard from '../catalog/ProductCard';
import { MOCK_PRODUCTS } from '../../lib/mockData';

/**
 * SimilarProducts — shows up to `limit` products from the same category.
 *
 * @param {{ categoryId: string, excludeId: string, limit?: number }} props
 */
export default function SimilarProducts({ categoryId, excludeId, limit = 4 }) {
  const { t } = useTranslation();

  const similarByCategory = MOCK_PRODUCTS
    .filter((p) => p.categoryId === categoryId && p._id !== excludeId);
  
  let similar = similarByCategory.slice(0, limit);

  if (similar.length < limit) {
    const remainingCount = limit - similar.length;
    const paddingProducts = MOCK_PRODUCTS.filter(
      (p) => p.categoryId !== categoryId && p._id !== excludeId
    ).slice(0, remainingCount);
    similar = [...similar, ...paddingProducts];
  }

  if (!similar.length) return null;

  return (
    <section className="mt-16 border-t border-gray-100 pt-12" aria-label={t('product.similar')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">{t('product.similar')}</h2>
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[600px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:gap-6">
        {similar.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
