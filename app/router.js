import Ember from 'ember';
import config from './config/environment';

let Router = Ember.Router.extend({
  location: config.locationType,

  notifications: Ember.inject.service(),

  clearNotifications: Ember.on('didTransition', function () {
      var notifications = this.get('notifications');

      notifications.closePassive();
      notifications.displayDelayed();
  })
});

export default Router.map(function() {
  this.route('login');
  this.route('forgotten');
  this.route('signup');
});
