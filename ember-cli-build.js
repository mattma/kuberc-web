/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

// Way to check the current environment
// var environment = EmberApp.env();
// var isProduction = environment === 'production';

module.exports = function(defaults) {
  var fontTree = pickFiles('bower_components/font-awesome/fonts', {
    srcDir: '/',
    files: ['fontawesome-webfont.eot','fontawesome-webfont.ttf','fontawesome-webfont.svg','fontawesome-webfont.woff', 'fontawesome-webfont.woff2', 'fontAwesome.otf'],
    destDir: '/fonts'
  });

  var app = new EmberApp(defaults, {
    babel: {
      optional: ['es7.decorators']
    },
    'ember-cli-mocha': {
      useLintTree: false
    },
    sassOptions: {
      extension: 'sass'
    },
    autoprefixer: {
      browsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
      ],
      cascade: false,
      sourcemap: true
    }
  });

  app.import('bower_components/font-awesome/css/font-awesome.min.css');
  app.import('bower_components/validator-js/validator.js');

  // app.env  can be used to assert environment

  return mergeTrees([app.toTree(), fontTree]);
};
