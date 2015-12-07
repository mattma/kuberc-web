import Ember from 'ember';
// start-non-standard
import {alias} from 'ember-computed-decorators';
// end-non-standard
const {Component, inject} = Ember;

export default Component.extend({
  notifications: inject.service(),

  tagName: 'aside',
  classNames: 'notifications',

  // start-non-standard
  @alias('notifications.notifications') messages
  // end-non-standard
});
