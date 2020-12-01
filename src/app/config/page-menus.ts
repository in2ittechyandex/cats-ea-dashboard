'use strict';
// var pageMenus = [{
//   'icon': 'fa fa-th-large',
//   'title': 'Dashboard',
//   'url': '',
//   'caret': 'true',
//   'submenu': [{
//     'url': 'dashboard/v1',
//     'title': 'Dashboard v1'
//   }, {
//     'url': 'dashboard/v2',
//     'title': 'Dashboard v2'
//   }]
// }];

// export default pageMenus;


const pageMenusUser = [
  {
    'icon': 'fa fa-home',
    'title': 'Summary',
    'label': '',
    'hide': false,
    'url': '/dashboard/summary'
  },
  {
    'icon': 'fa fa-users',
    'title': 'Engineer View',
    'label': '',
    'url': '/dashboard/engineer-view/cloud-dev-ops'
  },
  {
    'icon': 'fa fa-bell',
    'title': 'Alarms',
    'label': '',
    'hide': false,
    'url': '/dashboard/alarms'
  },
  {
    'icon': 'fab fa-simplybuilt',
    'title': 'Device Event',
    'label': '',
    'hide': false,
    'url': '/dashboard/events',
    'caret': 'true',
    'count': '0',
    'submenu': [
      {
        'title': 'RF',
        'caret': 'true',
        'submenu': [
          {
            'url': 'NEC',
            'title': 'NEC',
            'caret': ''
          },
          {
            'url': 'Huawei U2000 MW',
            'title': 'Huawei U2000 MW',
            'caret': ''
          }
        ]
      },
      {
        'title': 'IP',
        'caret': 'true',
        'submenu': [
          {
            'url': 'TMA',
            'title': 'TMA',
            'caret': ''
          },
          {
            'url': 'EMC NMS',
            'title': 'EMC NMS',
            'caret': ''
          }
        ]
      },
      {
        'title': 'TX',
        'caret': 'true',
        'submenu': [
          {
            'url': 'U2000TX',
            'title': 'U2000TX',
            'caret': ''
          },
          {
            'url': 'ADVA NMS',
            'title': 'ADVA NMS',
            'caret': ''
          }
        ]
      },
      {
        'title': 'Environmental',
        'caret': 'true',
        'submenu': [
          {
            'url': 'INALA',
            'title': 'INALA',
            'caret': ''
          },
          {
            'url': 'RFTS',
            'title': 'RFTS',
            'caret': ''
          }
        ]
      },
      {
        'title': 'Voice',
        'caret': 'true',
        'submenu': [
          {
            'url': 'N2000',
            'title': 'N2000',
            'caret': ''
          },
          {
            'url': 'U2020',
            'title': 'U2020',
            'caret': ''
          },
          {
            'url': 'METASWITCH SBC',
            'title': 'METASWITCH SBC',
            'caret': ''
          }
        ]
      },
      {
        'title': 'Wifi',
        'caret': 'true',
        'submenu': [
          {
            'url': 'RUCKUS ENT NMS',
            'title': 'RUCKUS ENT NMS',
            'caret': ''
          },
          {
            'url': 'RUCKUS CORP NMS',
            'title': 'RUCKUS CORP NMS',
            'caret': ''
          },
          {
            'url': 'MERAKI',
            'title': 'MERAKI',
            'caret': ''
          }
        ]
      }
    ]
  },
  {
    'icon': 'fa fa-cog',
    'title': 'Episode Configuration',
    'label': '',
    'hide':false,
    'url': '/dashboard/episode'
  },
  {
    'icon': 'fa fa-cog',
    'title': 'Case Configuration',
    'label': '',
    'hide':false,
    'url': '/dashboard/case'
  }
];
const pageMenusAdmin = [
  //   {
  //     'icon': 'fa fa-th-large',
  //     'title': 'Input Source',
  //     'label': '',
  //     'hide':false,
  //     'url': '/dashboard/home'
  //   },
  //   {
  //   'icon': 'fa fa-th-large',
  //   'title': 'Output Source',
  //   'label': '',
  //   'hide':false,
  //   'url': '/dashboard/output-source'
  // },
  // {
  //   'icon': 'fa fa-th-large',
  //   'title': 'Host',
  //   'label': '',
  //   'hide':false,
  //   'url': '/dashboard/ci'
  // },

  // {
  //   'icon': 'fab fa-simplybuilt',
  //   'title': 'Rules & Action',
  //   'label': '',
  //   'hide':false,
  //   'url': '/dashboard/rulesandaction'
  // }
  // ,{
  //   'icon': 'fa fa-th-large',
  //   'title': 'Manage Patterns',
  //   'label': '',
  //   'url': '/dashboard/patternedit'
  // }
];
const pageMenus = { 'userMenu': pageMenusUser, 'adminMenu': pageMenusAdmin };
export default pageMenus;

