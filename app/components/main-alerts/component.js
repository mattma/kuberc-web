import Ember from 'ember';
// start-non-standard
import {alias} from 'ember-computed-decorators';
// end-non-standard
const {Component, inject, observer} = Ember;

export default Component.extend({
  notifications: inject.service(),

  tagName: 'aside',
  classNames: 'alerts',

  // start-non-standard
  @alias('notifications.alerts') messages,
  // end-non-standard

  messageCountObserver: observer('messages.[]', function () {
    this.sendAction('notify', this.get('messages').length);
  })
});
