import Ember from 'ember';
import { filter } from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  notifications: service(),

  tagName:           'aside',
  classNames:        'notifications',
  classNameBindings: ['location'],

  @filter('notifications.content', function (notification) {
    return typeof notification.toJSON === 'function' ?
      notification.get('status') === 'passive' :
      notification.status === 'passive';
  }) messages
});
