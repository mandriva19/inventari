/**
 * Sanity schema — product
 *
 * Core listing document. All text fields are multilingual objects.
 * Images are Sanity-hosted assets resolved via @sanity/image-url.
 */
export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: () => '📦',
  groups: [
    { name: 'content',  title: 'Content',      default: true },
    { name: 'details',  title: 'Details' },
    { name: 'media',    title: 'Images' },
  ],
  fields: [
    // ── Content ──────────────────────────────────────────
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      group: 'content',
      description: 'Product name in all languages. Enter EN first — others can be auto-translated later.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'customId',
      title: 'Product ID (Manual)',
      type: 'string',
      group: 'content',
      description: 'A manually entered ID for this product (e.g., 001, A-123).',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      group: 'content',
    },

    // ── Details ──────────────────────────────────────────
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'details',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Availability Status',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: '✅ Available', value: 'available' },
          { title: '⚠️ Limited',   value: 'limited' },
          { title: '❌ Sold',      value: 'sold' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'condition',
      title: 'Condition',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: '🟢 Good',  value: 'good' },
          { title: '🟡 Fair',  value: 'ok' },
          { title: '🟠 Used',  value: 'used' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(0).integer(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'localizedString',
      group: 'details',
      description: 'Where the item is physically located (e.g. "Tbilisi, Saburtalo").',
    },

    // ── Images ───────────────────────────────────────────
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Short description for accessibility and SEO.',
            },
          ],
        },
      ],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.min(1).error('At least one image is required.'),
    },
  ],

  // Studio card preview
  preview: {
    select: {
      title:    'title.en',
      status:   'status',
      media:    'images.0',
      category: 'category.title.en',
    },
    prepare: ({ title, status, media, category }) => {
      const statusIcon = { available: '✅', limited: '⚠️', sold: '❌' }[status] || '';
      return {
        title:    `${statusIcon} ${title || 'Untitled'}`,
        subtitle: category || '',
        media,
      };
    },
  },

  // Default sort: newest first
  orderings: [
    { title: 'Newest first', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Title A–Z',    name: 'titleAsc',    by: [{ field: 'title.en',   direction: 'asc'  }] },
  ],
};
