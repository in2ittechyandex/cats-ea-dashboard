// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  _WEBGATEWAY_BASIC_URL_:  'http://172.27.63.182:8089/',
  _APACHEDEPLOYMENTLOCATION_URL: 'http://172.27.63.163:4200/#/',
  _NMS_URL: 'http://172.27.64.61:5050/',
  _EVENT_AGGREGATOR_LINK_URL: 'http://172.27.64.61:4200/catsea/#/dashboard/summary',
  _AUTH_GATEWAY_URL:   'http://cats.sanral.intra', // 'http://172.27.63.29:4200/logingateway', //
  _AUTH_PRODUCT_SERVICES_URL: 'http://cats.sanral.intra/#/services/products',
  // 'http://172.27.64.61:4200/logingateway/#/services/products',
  _CHATBOT_URL: 'http://172.27.63.162:5501',
  CONFIG: {
    N: 10,
    HOSTCOLOR: '#d9c8ae',
    SERVICECOLOR: '#8dcc93',
    SPECTRUM: [
      'rgb(176,212,243)',
      'rgb(128,186,236)',
      'rgb(77,158,228)',
      'rgb(38,137,223)',
      'rgb(0,116,217)',
      'rgb(0,106,197)'
    ],
    ApiURL: 'http://172.27.64.61:7000/'
  },
  _NMS_HOST_NODES_D3CHARTS_CONFIG: {
    N: 10,
    HOSTCOLOR: '#d9c8ae',
    SERVICECOLOR: '#8dcc93',
    SPECTRUM: [
      'rgb(176,212,243)',
      'rgb(128,186,236)',
      'rgb(77,158,228)',
      'rgb(38,137,223)',
      'rgb(0,116,217)',
      'rgb(0,106,197)'
    ],
    ApiURL: 'http://172.27.64.61:7000/'
  },
  _IgnoreAuthHeadersURL: [
    'api.myjson', 'env.json'
  ],
  version: '0.1.0',
  gateWayAuthorization: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
