import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.apiUrl,
  namespace: `api/${config.api.current}`,

  authorizer: config.emberSimpleAuth.authorizer,

  // make sure it is a mobile request. handle on the server
  // to determine use mobile number or email, etc
  // Also send the default locale to the server too
  headers: {
    'is-mobile-request': config.isMobileRequest,
    'i18n-locale': config.i18n.defaultLocale
  },

  // make individual relationships request into one request ONLY
  // ex: http://example.com/api/authors?filter[id]=matt,tom
  coalesceFindRequests: true,

  // take an ajax response, returns json payload or an error
  handleResponse (status, headers, payload) {
    return payload;
  },

  urlForFindRecord(query, modelName, snapshot) {
    let url = this._super(...arguments);
    return this._processIncludes(url, snapshot);
  },

  urlForFindAll(query, modelName, snapshot) {
    let url = this._super(...arguments);
    return this._processIncludes(url, snapshot);
  },

  // allow each find/findRecord to fetch with `?include=` query param
  // Ex: this.store.findRecord('type', id, {adapterOptions: {include: 'relationships'}})
  _processIncludes(url, snapshot) {
    let options = snapshot && snapshot.adapterOptions;

    if (options && options.include) {
      url = `${url}?include=${options.include}`;
    }
    return url;
  }
});
