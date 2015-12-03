import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  tagName:           'aside',
  classNames:        'notifications',
  classNameBindings: ['location'],

  notifications: service(),

  messages: Ember.computed.filter('notifications.content', (notification) => {
    const displayStatus = (typeof notification.toJSON === 'function') ?
        notification.get('status') : notification.status;

    return displayStatus === 'passive';
  })
});
