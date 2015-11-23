import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionAccount: service('session-account'),

  currentUser: Ember.computed.alias('sessionAccount.currentUser.content')
});
