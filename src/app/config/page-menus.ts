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
    'submenu': []
  },
  // {
  //   'icon': 'fa fa-cog',
  //   'title': 'Patterns',
  //   'label': '',
  //   'hide':false,
  //   'url': '/dashboard/pattern'
  // }
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

