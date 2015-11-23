/* jshint node: true */
var os = require('os');
var ifaces = os.networkInterfaces();

var addresses = [];
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details){
    if(details.family === 'IPv4' && details.address !== '127.0.0.1') {
      addresses.push(details.address);
    }
  });
}

const localhost = '10.0.1.20';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dashboard',
    environment: environment,
    baseURL: '/',
    defaultLocationType: 'auto',
    // locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    api: {
      "current": "v1beta1"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-simple-auth': {
      routeAfterAuthentication: 'dashboard',
      routeIfAlreadyAuthenticated: 'dashboard',
      authenticationRoute: 'login'
    },

    'emberSimpleAuth': {
      authorizer: 'authorizer:local'
      // crossOriginWhitelist: [`http://${localhost}:3002`]
    },

    i18n: {
      defaultLocale: 'zh-cn'
    },

    contentSecurityPolicy: {
      // Allow inline styles
      'style-src': "'self' 'unsafe-inline'",
      'connect-src': `'self' http://${localhost}:3002 ws://localhost:35729 ws://0.0.0.0:35729`,
      'script-src': "'self' 'unsafe-inline'",
      'font-src': "'self' data:",
      'object-src': "http://localhost:4200"
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.apiUrl = `http://${addresses[0]}:3002`;
    ENV['emberSimpleAuth'].crossOriginWhitelist = [`http://${localhost}:3002`];
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiUrl = '';
    ENV['simple-auth'].crossOriginWhitelist = [''];
  }

  return ENV;
};
