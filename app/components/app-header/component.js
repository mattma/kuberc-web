import Ember from 'ember';
// start-non-standard
import {alias} from 'ember-computed-decorators';
// end-non-standard
const {Component, inject} = Ember;

export default Component.extend({
  session: inject.service('session'),
  sess: inject.service('session-account'),

  // sessionUser: an object contains current login user info
  // start-non-standard
  @alias('sess.sessionUser.content') sessionUser,
  // end-non-standard

  actions: {
    // application/route.js will handle the logout action
    logoutAction () {
      this.sendAction('logout');
    }
  }
});
