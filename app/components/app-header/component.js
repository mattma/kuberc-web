import Ember from 'ember';
// start-non-standard
import {alias} from 'ember-computed-decorators';
// end-non-standard
const {Component, inject} = Ember;
import togglePropUtils from 'dashboard/utils/toggle-property';

export default Component.extend({
  session: inject.service('session'),
  sess: inject.service('session-account'),

  showSidebar: false,

  // sessionUser: an object contains current login user info
  // start-non-standard
  @alias('sess.sessionUser.content') sessionUser,
  // end-non-standard

  actions: {
    // application/route.js will handle the logout action
    toggleSidebar () {
      togglePropUtils('showSidebar', this);
    }
  }
});
