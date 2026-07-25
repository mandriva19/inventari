/**
 * Sanity schema — category
 *
 * A simple reference document for product categories.
 * The frontend uses category slugs (id) to filter products.
 */
export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: () => '🗂️',
  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'localizedString',
      description: 'Display name in all 5 languages.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (ID)',
      type: 'slug',
      description: 'Unique identifier used in filters (e.g. "chair", "table").',
      options: { source: 'title.en', maxLength: 48 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first in filter bar.',
      initialValue: 99,
    },
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
};
