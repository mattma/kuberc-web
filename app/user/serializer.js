import DS from 'ember-data';
import Ember from 'ember';

const camelize = Ember.String.camelize;

// https://github.com/emberjs/data/blob/master/TRANSITION.md
export default DS.JSONAPISerializer.extend({
  keyForAttribute (key /*, method*/) {
    return camelize(key);
  },

  // normalize (typeClass, hash) {
  //   console.log('hash: ', hash);
  //   hash.data.meta = hash.meta;
  //   return this._super(this, arguments);
  // }

  // extractAttributes (modelClass, resourceHash) {
  // }

  // normalizeResponse (store, primaryModelClass, payload, id, requestType) {
  //   return this._super(store, primaryModelClass, payload, id, requestType);
  // }
});
