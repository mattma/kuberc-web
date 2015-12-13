import Ember from 'ember';
// start-non-standard
import { alias } from 'ember-computed-decorators';
// end-non-standard
const {Component} = Ember;

function toggleDropdownUtil (property, context) {
  context.get(property) ?
    context.set(property, false) :
    context.set(property, true);
}

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
    // Need to remove, here for education purpose
    // parent component will handle "logoutAction"
    logoutAction () {
      // it has to update "action" property to be able to `sendAction`
      this.set('action', 'logoutAction');
      this.sendAction();
    },

    toggleUserDropdown () {
      toggleDropdownUtil('showUserDropdown', this);
    },

    toggleTasksDropdown () {
      toggleDropdownUtil('showTasksDropdown', this);
    }
  }
});
