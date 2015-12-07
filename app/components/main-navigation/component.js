import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
const {Component} = Ember;

export default Component.extend({
  tagName: 'nav',

  // targetObject: required keyword to send action to parent component
  @alias('parentView') targetObject,

  actions: {
    // parent component will handle "logoutAction"
    logoutAction () {
      // it has to update "action" property to be able to `sendAction`
      this.set('action', 'logoutAction');
      this.sendAction();
    }
  }
});
