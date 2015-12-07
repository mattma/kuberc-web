import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
const {Component, inject} = Ember;

export default Component.extend({
  session: inject.service('session'),
  sess: inject.service('session-account'),

  // sessionUser: an object contains current login user info
  @alias('sess.sessionUser.content') sessionUser,

  actions: {
    // application/route.js will handle the logout action
    logoutAction () {
      this.sendAction('logout');
    }
  }
});
