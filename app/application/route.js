import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import simpleAuthConfig from 'ember-simple-auth/configuration';
const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  notifications: service(),

  // trigger by logout route when user successfully logout
  sessionInvalidated () {
    this.transitionTo(simpleAuthConfig.authenticationRoute);
    this.get('notifications')
      .showNotification('notification.token_verification.success_clear_token', {delayed: true, type: 'success'});
  },

  actions: {
    logout () {
      this.transitionTo('logout');
    }
  }
});
