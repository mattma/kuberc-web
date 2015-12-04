import Ember from 'ember';
import { filter } from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  notifications: service(),

  tagName:           'aside',
  classNames:        'notifications',
  classNameBindings: ['location'],

  @filter('notifications.content', notification => {
    const displayStatus = (typeof notification.toJSON === 'function') ?
        notification.get('status') : notification.status;

    return displayStatus === 'passive';
  }) messages
});
