import Ember from 'ember';
import DS from 'ember-data';

const { service } = Ember.inject;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  currentUser: Ember.computed('session.data.authenticated.name', function() {
    const {name} = this.get('session.data.authenticated');
    if (!Ember.isEmpty(name)) {
      return DS.PromiseObject.create({
        promise: this.get('store').findRecord('user', name)
      });
    }
  })
});
