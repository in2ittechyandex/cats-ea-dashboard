export const environment = {
  production: true,
  _WEBGATEWAY_BASIC_URL_:  'http://cats.sanral.intra/API/',  // 'http://172.27.63.59:7070/', // 
  // 'http://172.27.63.59:7070/', // 'http://172.20.8.120:8089/', // 'http://172.27.63.61:8089/',
  _APACHEDEPLOYMENTLOCATION_URL: 'http://172.27.63.163:4200/#/',
  _NMS_URL: 'http://172.27.64.61:5050/',
  _EVENT_AGGREGATOR_LINK_URL: 'http://172.27.64.61:4200/catsea/#/dashboard/summary',
  _AUTH_GATEWAY_URL:    'http://cats.sanral.intra', // 'http://172.27.63.29:4200/logingateway', //
  _AUTH_PRODUCT_SERVICES_URL: 'http://cats.sanral.intra/#/services/products',
   // 'http://172.27.63.29:4200/logingateway/#/services/products',
  // 'http://172.27.64.61:4200/logingateway/#/services/products', // ,
  //
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
