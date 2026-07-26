export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'The main logo displayed in the top bar and footer.',
    },
    {
      name: 'phone1',
      title: 'Phone Number 1 (Main)',
      type: 'string',
      description: 'E.g., +995 555 123 456',
    },
    {
      name: 'phone2',
      title: 'Phone Number 2 (WhatsApp)',
      type: 'string',
      description: 'E.g., +995 555 123 456',
    }
  ]
};
