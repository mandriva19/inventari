export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header',  title: 'Site Header' },
    { name: 'contact', title: 'Contact Channels (CTA)' },
  ],
  fields: [
    {
      name: 'siteName',
      title: 'Site Title',
      type: 'string',
      group: 'general',
      description: 'The title of the website displayed in the browser tab (e.g. "Inventari").',
      initialValue: 'Inventari',
    },
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
      description: 'The main logo displayed in the top bar and footer.',
    },
    {
      name: 'favicon',
      title: 'Site Favicon',
      type: 'image',
      group: 'general',
      description: 'Upload a favicon (.png or .ico) to show in the browser tab.',
    },
    {
      name: 'contactOptions',
      title: 'Contact Options (CTA Groups)',
      type: 'array',
      group: 'contact',
      of: [{ type: 'contactOption' }],
      description: 'Define groups of contact buttons shown in the Contact Us modal.',
    },
    // ── Site Header ─────────────────────────────────────────
    {
      name: 'headerTitle',
      title: 'Header Title Text',
      type: 'localizedString',
      group: 'header',
      description: 'The title/announcement text displayed in the sticky header bar.',
    },
    {
      name: 'headerTitleFontSize',
      title: 'Font Size',
      type: 'string',
      group: 'header',
      initialValue: 'text-base',
      options: {
        list: [
          { title: 'Extra Small', value: 'text-xs' },
          { title: 'Small',       value: 'text-sm' },
          { title: 'Medium',      value: 'text-base' },
          { title: 'Large',       value: 'text-lg' },
          { title: 'Extra Large',  value: 'text-xl' },
        ],
      },
    },
    {
      name: 'headerTitleColor',
      title: 'Font Color',
      type: 'string',
      group: 'header',
      initialValue: '#1f2937',
      options: {
        list: [
          { title: 'Dark Gray (Default)', value: '#1f2937' },
          { title: 'Primary Blue',        value: '#3665f3' },
          { title: 'Red',                 value: '#ef4444' },
          { title: 'Green',               value: '#10b981' },
          { title: 'Amber',               value: '#f59e0b' },
          { title: 'Soft Teal (#5b9b8b)', value: '#5b9b8b' },
          { title: 'Soft Gold (#e4b654)', value: '#e4b654' },
          { title: 'White',               value: '#ffffff' },
        ],
      },
    },
  ]
};
