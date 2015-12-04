import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import styleBody from 'dashboard/mixins/style-body';
const { service } = Ember.inject;

export default Ember.Route.extend(UnauthenticatedRouteMixin, styleBody, {
  notifications: service(),

  classNames: ['page', 'login'],

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
