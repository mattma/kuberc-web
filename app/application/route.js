import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import simpleAuthConfig from 'ember-simple-auth/configuration';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  notifications: service(),
  session: service('session'),

  // beforeModel () {
  //   if (this.get('session.isAuthenticated')) {
  //     return this._populateCurrentUser();
  //   }
  // },

  // _populateCurrentUser () {
  //   const {name} = this.get('session.data.authenticated');
  //   return this.get('store').findRecord('user', name)
  //     .then(user => this.get('currentUser').set('content', user))
  //     .catch(err => this._requiresAuthentication(err));
  // },

  // _requiresAuthentication (err) {
  //   let session = this.get('session');
  //   // When user logged in for too long, the session expired, it will trigger
  //   // an `requiresAuthentication` issue. But user would still be on the
  //   // authenticated page, the reason for that is, since it has "AuthName" and
  //   // AuthToken So we need to clear "session" data, and reset "currentUser"
  //   if (session.get('isAuthenticated')) {
  //     session.invalidate().then(() => this.get('currentUser').set('content', null));
  //   }

  //   this.transitionTo(simpleAuthConfig.authenticationRoute);

  //   const e = err && err.title ? err.title : 'notification.token_verification.require_login';
  //   this.get('notifications').showError(e, {delayed: true});
  // },

  // you have successfully logged in
  // sessionAuthenticated () {
  //   return this._populateCurrentUser()
  //     .then(() => this.transitionTo(simpleAuthConfig.routeAfterAuthentication));
  // },

  // When user successfully logout, called by "initializers/authentication.js#invalidate"
  sessionInvalidated () {
    this.transitionTo(simpleAuthConfig.authenticationRoute);
    this.get('notifications')
      .showSuccess('notification.token_verification.success_clear_token', {delayed: true});
  },

  actions: {
    // action will be triggered when user create an account 1st time
    // be triggered when user reset his/her password
    sessionAuthenticationSucceededAndShowIntro () {
      return this._populateCurrentUser()
        .then(() => this.transitionTo('intro'));
    },

    // log in error use case
    sessionAuthenticationFailed (err) {
      this.get('notifications').showAPIError(err);
    },

    sessionRequiresAuthentication () {
      this._requiresAuthentication();
    }

    // When an authorization error occurs, it could be Server force user to logout
    // authorizationFailed () {
    //   this._super(...arguments);
    //   this.get('notifications')
    //     .showSuccess('notification.token_verification.invalidation', {delayed: true});
    // }
  }
});
