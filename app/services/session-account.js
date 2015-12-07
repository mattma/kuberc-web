import Ember from 'ember';
import DS from 'ember-data';
// start-non-standard
import { alias } from 'ember-computed-decorators';
// end-non-standard
// start-non-standard
import computed from 'ember-computed-decorators';
// end-non-standard
const {inject, isEmpty} = Ember;

export default Ember.Service.extend({
  session: inject.service('session'),
  store: inject.service(),

  // start-non-standard
  @alias('session.data.authenticated.name') username,
  // end-non-standard

  // start-non-standard
  @computed('username')
  // end-non-standard
  sessionUser (name) {
    if (!isEmpty(name)) {
      return DS.PromiseObject.create({
        promise: this.get('store').findRecord('user', name)
      });
    }
  }
});
