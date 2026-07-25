import { useTranslation } from 'react-i18next';
import ProductCard from '../catalog/ProductCard';
import { useSimilarProducts } from '../../hooks/useSimilarProducts';

/**
 * SimilarProducts — shows up to `limit` products from the same category.
 *
 * @param {{ categoryId: string, slug: string, limit?: number }} props
 */
export default function SimilarProducts({ categoryId, slug, limit = 4 }) {
  const { t } = useTranslation();
  const { similar, isLoading } = useSimilarProducts(categoryId, slug, limit);

  if (isLoading || !similar.length) return null;

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
