import { createClient } from '@sanity/client';
import imageUrlBuilder  from '@sanity/image-url';

// ── Client ────────────────────────────────────────────────────────────────────
export const sanityClient = createClient({
  projectId:  import.meta.env.VITE_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset:    import.meta.env.VITE_SANITY_DATASET    || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token:      import.meta.env.VITE_SANITY_TOKEN      || undefined,
  useCdn:     true, // cached reads — fast for public catalog
  perspective: 'published',
});

/** Returns true when the env vars are configured */
export const isSanityConfigured =
  Boolean(import.meta.env.VITE_SANITY_PROJECT_ID) &&
  import.meta.env.VITE_SANITY_PROJECT_ID !== 'your_project_id';

// ── Image URL builder ─────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);

/**
 * Builds an optimized Sanity image URL.
 * @param {object} source - Sanity image reference object
 * @returns {import('@sanity/image-url/lib/types/builder').ImageUrlBuilder}
 */
export function urlFor(source) {
  return builder.image(source);
}

// ── GROQ fragments ────────────────────────────────────────────────────────────

/** Multilingual string fields projected inline */
const LOCALIZED_STRING = `{ en, ka, ru, tr, ar }`;

/** Category projection */
const CATEGORY_PROJECTION = `
  _id,
  "id": slug.current,
  title ${LOCALIZED_STRING},
  order
`;

/** Product card projection (lightweight — for grid) */
const PRODUCT_CARD_PROJECTION = `
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  status,
  condition,
  quantity,
  location ${LOCALIZED_STRING},
  "categoryId": category->slug.current,
  "images": images[].asset->url
`;

/** Full product projection (for single product page) */
const PRODUCT_FULL_PROJECTION = `
  ${PRODUCT_CARD_PROJECTION},
  description ${LOCALIZED_STRING},
  "category": category->{ id, title ${LOCALIZED_STRING} }
`;

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered by display order.
 */
export const QUERY_CATEGORIES = `
  *[_type == "category"] | order(order asc) {
    ${CATEGORY_PROJECTION}
  }
`;

/**
 * Fetch paginated products with optional category + status filters.
 *
 * @param {{ category?: string, status?: string, offset?: number, limit?: number }} params
 */
export function buildProductsQuery({ category, status, offset = 0, limit = 12 } = {}) {
  const filters = ['_type == "product"'];
  if (category) filters.push(`category->slug.current == $category`);
  if (status)   filters.push(`status == $status`);

  return `{
    "items": *[${filters.join(' && ')}] | order(_createdAt desc) [${offset}...${offset + limit}] {
      ${PRODUCT_CARD_PROJECTION}
    },
    "total": count(*[${filters.join(' && ')}])
  }`;
}

/**
 * Fetch a single product by slug.
 */
export function buildProductBySlugQuery() {
  return `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FULL_PROJECTION} }`;
}

/**
 * Fetch similar products (same category, different slug, max N).
 */
export function buildSimilarProductsQuery() {
  return `*[_type == "product" && category->slug.current == $categoryId && slug.current != $slug] | order(_createdAt desc) [0...$limit] {
    ${PRODUCT_CARD_PROJECTION}
  }`;
}
