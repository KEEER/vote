window.KVoteFormData = {
  title: 'TestTitle',
  action: '/',
  method: 'POST',
  data: [
    [
      {
        id: 1,
        type: 'VRadio',
        title: '1. Select one',
        value: '2',
        options: [
          {
            label: 'One',
            value: '1',
          },
          {
            label: 'Two',
            value: '2',
          },
          {
            label: 'Three',
            value: '3',
          },
        ],
      },
      {
        id: 2,
        type: 'VCheckbox',
        title: '2. Select one',
        value: {
          '1': true,
        },
        options: [
          {
            label: 'One',
            value: '1',
          },
          {
            label: 'Two',
            value: '2',
          },
          {
            label: 'Three',
            value: '3',
          },
        ],
      },
    ],
    [
      {
        id: 3,
        type: 'VText',
        title: '3. Input',
        value: '2',
      },
      {
        id: 4,
        type: 'VTextarea',
        title: '4. Input',
        value: '2',
      },
    ],
  ],
}
