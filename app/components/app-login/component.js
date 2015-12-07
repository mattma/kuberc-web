import Ember from 'ember';
import ValidationEngine from 'dashboard/mixins/validation-engine';
const {Component, inject} = Ember;

export default Component.extend(ValidationEngine, {
  session: inject.service('session'),

  tagName: 'section',
  validationType: 'login',

  actions: {
    authenticate () {
      const data = this.getProperties('identification', 'password');
      // authenticators/local.js#authenticate will handle the validation
      this.get('session').authenticate('authenticator:local', data)
        .then(() =>  this.sendAction('clearAllNotifications'))
        .catch(err => this.sendAction('sessionAuthenticationFailed', err));
    },

    validateAndAuthenticate () {
      this.validate()
        .then(() => this.send('authenticate'))
        .catch(() => this.sendAction('preAuthenticationFailed', this.get("errors")));
    }
  }
});
