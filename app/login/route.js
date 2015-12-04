import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
const { service } = Ember.inject;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  notifications: service(),

  actions: {
    // Authentication errors returned from server
    sessionAuthenticationFailed (err) {
      this.get('notifications').showAPIError(err);
    },

    // Authentication errors handled client side, no server interaction
    preAuthenticationFailed (err) {
      this.get('notifications').showErrors(err);
    }
  }
});
