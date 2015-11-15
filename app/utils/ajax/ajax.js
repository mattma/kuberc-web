import Ember from "ember";
import config from "../../config/environment";

export default function(url, options){
  if (config.environment === "test") {
    url = url.replace(new RegExp('[^/]*(//)?[^/]*/'), '/');
  }

  url = `${config.apiUrl}/api/${config.api.current}${url} `;

  return new Ember.RSVP.Promise(function(resolve, reject){
    options.dataType = 'json';
    options.success = Ember.run.bind(null, resolve);
    options.error = Ember.run.bind(null, reject);
    options.crossDomain = true;
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.data);
    // make sure it is a mobile request. handle on the server
    // to determine use mobile number or email, etc
    // Also send the default locale to the server too
    options.headers = {
      'is-mobile-request': config.isMobileRequest,
      'i18n-locale': config.i18n.defaultLocale
    };
    Ember.$.ajax(url, options);
  });
}
