import Ember from 'ember';
import DS from 'ember-data';
import { alias } from 'ember-computed-decorators';
import computed from 'ember-computed-decorators';
const { service } = Ember.inject;
const { isEmpty } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  @alias('session.data.authenticated.name') username,

  @computed('username')
  sessionUser (name) {
    if (!isEmpty(name)) {
      return DS.PromiseObject.create({
        promise: this.get('store').findRecord('user', name)
      });
    }
  }
});
