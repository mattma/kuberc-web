import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  sess: service('session-account'),

  // sessionUser: an object contains current login user info
  @alias('sess.sessionUser.content') sessionUser,

  actions: {
    // application/route.js will handle the logout action
    logoutAction () {
      this.sendAction('logout');
    }
  }
});
