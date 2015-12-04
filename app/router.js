import Ember from 'ember';
import config from './config/environment';
const { service } = Ember.inject;

let Router = Ember.Router.extend({
  notifications: service(),

  location: config.locationType,

  clearNotifications: Ember.on('didTransition', function () {
    const notifications = this.get('notifications');

    notifications.closePassive();
    notifications.displayDelayed();
  })
});

export default Router.map(function() {
  this.route('signup');
  this.route('login');
  this.route('forgotten');

  // AuthenticatedRoute is required
  this.route('logout');
  this.route('dashboard');
});
