import Ember from 'ember';
import ValidationEngine from 'dashboard/mixins/validation-engine';
const { service } = Ember.inject;

export default Ember.Component.extend(ValidationEngine, {
  classNames: ['page-login'],
  rememberMe: false,
  validationType: 'signin',

  notifications: service(),
  session: service('session'),

  rememberMeChanged: function() {
    console.log('remember me called');
    this.get('session.store').cookieExpirationTime = this.get('rememberMe') ?
      (14 * 24 * 60 * 60) : null;
  }.observes('rememberMe'),

  actions: {
    authenticate () {
      const data = this.getProperties('identification', 'password');
      // if authentication fails a rejected promise returned from "initializers/authentication"
      // Application/route.js#sessionAuthenticationFailed will handle all error cases
      this.get('session').authenticate('authenticator:local', data);
    },

    validateAndAuthenticate () {
      let notifications = this.get('notifications');
      this.validate({format: false})
        .then(() => {
          notifications.closePassive();
          this.send('authenticate');
        })
        .catch(err => notifications.showErrors(err));
    }
  }
});
