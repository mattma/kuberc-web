import Ember from 'ember';
import ValidationEngine from 'dashboard/mixins/validation-engine';
const { service } = Ember.inject;

export default Ember.Component.extend(ValidationEngine, {
  notifications: service(),
  session: service('session'),

  classNames: ['page-login'],
  validationType: 'signin',

  actions: {
    authenticate () {
      const data = this.getProperties('identification', 'password');
      // authenticators/local.js#authenticate will handle the validation
      this.get('session').authenticate('authenticator:local', data)
        .catch(err => this.sendAction('sessionAuthenticationFailed', err));
    },

    validateAndAuthenticate () {
      // close all notifications if any
      this.get('notifications').closePassive();

      this.validate({format: false})
        .then(() => this.send('authenticate'))
        .catch(err => this.sendAction('preAuthenticationFailed', err));
    }
  }
});
