export const contactOption = {
  name: 'contactOption',
  title: 'Contact Option Group',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label (e.g. Georgia, International)',
      type: 'localizedString',
    },
    {
      name: 'channels',
      title: 'Channels',
      type: 'array',
      of: [{ type: 'contactChannel' }],
    }
  ]
};
