import Ember from 'ember';
// start-non-standard
import { alias } from 'ember-computed-decorators';
// end-non-standard
const {Component} = Ember;

export default Component.extend({
  tagName: 'section',
  classNames: ['main-nav'],

  // targetObject: required keyword to send action to parent component
  // start-non-standard
  @alias('parentView') targetObject,
  // end-non-standard

  actions: {
    // parent component will handle "logoutAction"
    logoutAction () {
      // it has to update "action" property to be able to `sendAction`
      this.set('action', 'logoutAction');
      this.sendAction();
    }
  }
});
