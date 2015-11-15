import Ember from 'ember';

export default Ember.Component.extend({
  tagName:           'aside',
  classNames:        'notifications',
  classNameBindings: ['location'],

  notifications: Ember.inject.service(),

  messages: Ember.computed.filter('notifications.content', function (notification) {
      let displayStatus = (typeof notification.toJSON === 'function') ?
          notification.get('status') : notification.status;

      return displayStatus === 'passive';
  })
});
