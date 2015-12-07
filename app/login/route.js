import Ember from 'ember';
import DS from 'ember-data';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import styleBody from 'dashboard/mixins/style-body';
const {Route, inject} = Ember;
const {Errors} = DS;

export default Route.extend(UnauthenticatedRouteMixin, styleBody, {
  notifications: inject.service(),

  classNames: ['page', 'login'],

  model() {
    return Ember.Object.create({
      identification: '',
      password: '',
      errors: Errors.create()
    });
  },

  actions: {
    clearAllNotifications () {
      this.get('notifications').clearAll();
    },

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
