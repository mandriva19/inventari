import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { useProduct } from '../hooks/useProduct';
import { CATEGORIES } from '../lib/mockData';
import { Helmet } from 'react-helmet-async';

import ImageSwiper    from '../components/product/ImageSwiper';
import { MetaBadge, MetaGrid } from '../components/product/MetaBadge';
import ContactCTA     from '../components/product/ContactCTA';
import SimilarProducts from '../components/product/SimilarProducts';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

export default function ProductPage({ slug }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const { product, isLoading } = useProduct(slug);

  if (isLoading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3665f3]"></div>
        </div>
      </main>
    );
  }

  /* ── 404 ── */
  if (!product) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
          <p className="text-xl font-semibold text-gray-900 mb-6">
            Product not found.
          </p>
          <Link to="/" className="inline-flex items-center justify-center bg-[#3665f3] hover:bg-[#2b51c2] text-white font-bold uppercase tracking-wider px-6 py-3 transition-colors rounded-none">
            {t('product.back')}
          </Link>
        </div>
      </main>
    );
  }

  const category = product.category || CATEGORIES.find((c) => c.id === product.categoryId);
  const categoryLabel = category?.title || category?.label;

  /* ── Meta grid items ── */
  const metaItems = [
    {
      label: 'ID',
      value: <span className="font-mono text-gray-900">{product.customId || product._id?.substring(0, 8) || product._id}</span>,
    },
    {
      label: t('product.condition'),
      value: product.condition,
      badge: product.condition
        ? <MetaBadge type="condition" value={product.condition} />
        : null,
    },
    {
      label: t('product.quantity'),
      value: product.quantity,
    },
    {
      label: t('product.location'),
      value: localize(product.location),
    },
    {
      label: t('product.category'),
      value: <span className="text-gray-900 font-medium">{categoryLabel ? localize(categoryLabel) : '—'}</span>,
    },
  ];

  const pageTitle = `${localize(product.title)} | Inventari`;
  const pageDescription = localize(product.description) || t('footer.tagline');
  const imageUrl = product.images?.[0] || '/assets/logo.png';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" id="main-content">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={imageUrl} />
      </Helmet>

      {/* ── Breadcrumb / back ── */}
      <nav className="mb-6 lg:mb-8" aria-label="Breadcrumb">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3665f3] font-medium transition-colors text-sm">
          <BackIcon />
          {t('product.back')}
        </Link>
      </nav>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,400px)] gap-8 lg:gap-12">

        {/* ── LEFT: gallery ── */}
        <div className="min-w-0">
          <ImageSwiper
            images={product.images || []}
            alt={localize(product.title)}
          />
        </div>

        {/* ── RIGHT: info ── */}
        <div className="flex flex-col gap-6">

          {/* Top row: category label + status badge */}
          <div className="flex items-center flex-wrap gap-3">
            {category && (
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {localize(category.label)}
              </span>
            )}
            {product.status && (
              <MetaBadge type="status" value={product.status} />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight">
            {localize(product.title)}
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {localize(product.description)}
          </p>

          {/* Meta attributes */}
          <MetaGrid items={metaItems} />

          {/* CTA */}
          <div className="mt-4">
            <ContactCTA
              productId={product._id}
              productTitle={product.title}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* ── Similar products ── */}
      <div className="mt-16 lg:mt-24">
        <SimilarProducts
          categoryId={product.categoryId}
          slug={product.slug}
          limit={4}
        />
      </div>

    </main>
  );
}
