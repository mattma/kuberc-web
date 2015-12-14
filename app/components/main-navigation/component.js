import Ember from 'ember';
// start-non-standard
import { alias } from 'ember-computed-decorators';
// end-non-standard
const {Component} = Ember;
import togglePropUtils from 'dashboard/utils/toggle-property';

export default Component.extend({
  tagName: 'nav',
  classNames: ['main-container', 'main-navigation'],

  // show/hide User dropdown menu
  showUserDropdown: false,
  showTasksDropdown: false,

  // targetObject: required keyword to send action to parent component
  // start-non-standard
  @alias('parentView') targetObject,
  // end-non-standard

  actions: {
    // parent component will handle "toggleSidebar"
    toggleSidebar () {
      // it has to update "action" property to be able to `sendAction`
      this.set('action', 'toggleSidebar');
      this.sendAction();
    },

    toggleUserDropdown () {
      togglePropUtils('showUserDropdown', this);
    },

    toggleTasksDropdown () {
      togglePropUtils('showTasksDropdown', this);
    }
  }
});
