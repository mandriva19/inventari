export const contactChannel = {
  name: 'contactChannel',
  title: 'Contact Channel',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Channel Type',
      type: 'string',
      options: {
        list: [
          { title: 'Phone Call', value: 'phone' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'Facebook Messenger', value: 'messenger' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Viber', value: 'viber' },
          { title: 'Signal', value: 'signal' },
          { title: 'SMS', value: 'sms' },
          { title: 'Email', value: 'email' },
          { title: 'WeChat', value: 'wechat' },
        ]
      }
    },
    {
      name: 'value',
      title: 'Number / Username / Link',
      type: 'string',
      description: 'Phone number for Call/WhatsApp/Viber/Signal/SMS (e.g. +995555123456); Username for Telegram/Messenger/Instagram/WeChat (e.g. equipment_page); Email address for Email.',
    }
  ]
};
