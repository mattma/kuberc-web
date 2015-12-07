import Ember from 'ember';
import {alias} from 'ember-computed-decorators';
const {Component, inject, observer} = Ember;

export default Component.extend({
  notifications: inject.service(),

  tagName: 'aside',
  classNames: 'alerts',

  @alias('notifications.alerts') messages,

  messageCountObserver: observer('messages.[]', function () {
    this.sendAction('notify', this.get('messages').length);
  })
});
