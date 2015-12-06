import Ember from 'ember';
import {alias} from 'ember-computed-decorators';
const {Component, inject} = Ember;

export default Component.extend({
  notifications: inject.service(),

  tagName: 'aside',
  classNames: 'notifications',

  @alias('notifications.notifications') messages
});
