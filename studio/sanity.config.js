import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes/index.js';

export default defineConfig({
  name: 'inventari-studio',
  title: 'Inventari CMS',

  projectId: '1g7tc639',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Products')
              .icon(() => '📦')
              .child(
                S.documentTypeList('product')
                  .title('All Products')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Categories')
              .icon(() => '🗂️')
              .child(
                S.documentTypeList('category')
                  .title('Categories')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !['product', 'category'].includes(item.getId())
            ),
          ]),
    }),
    visionTool(), // GROQ query explorer
  ],

  schema: { types: schemaTypes },
});
