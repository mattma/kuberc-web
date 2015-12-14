import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import simpleAuthConfig from 'ember-simple-auth/configuration';
const {Route, inject} = Ember;

export default Route.extend(ApplicationRouteMixin, {
  notifications: inject.service(),

  // trigger by logout route when user successfully logout
  sessionInvalidated () {
    this.transitionTo(simpleAuthConfig.authenticationRoute);
    this.get('notifications')
      .showNotification('notification.token_verification.success_clear_token', {delayed: true, type: 'success'});
  },

  actions: {
    topNotificationChange (count=0) {
      this.set('topNotificationCount', count);
    },
  }
});
