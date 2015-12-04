import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ajax from 'dashboard/utils/ajax/ajax';
const { service } = Ember.inject;
const { RSVP } = Ember;

export default Base.extend({
  session: service('session'),

  authenticate (credentials) {
    // new user verify his/her account, we will auto log this user in
    if (credentials.isAuthenticate && credentials.session) {
      const sessionData = {
        token: credentials.session.token,
        name: credentials.session.name
      };
      return RSVP.resolve(sessionData);
    } else {
      const url = '/login';
      const opts =  {
        type: "POST",
        data: {
          username: credentials.identification,
          password: credentials.password
        }
      };

      // Need to return a promise because "login" need to wait for a promise object
      return new RSVP.Promise((resolve, reject) => {
        return ajax(url, opts)
          .then(resp => resolve({token: resp.session.token, name: resp.session.name}))
          .catch(err => reject(err));
      });
    }
  },

  invalidate (credentials) {
    // if (data.authenticated) can be check as well
    return new RSVP.Promise(resolve => {
      if (credentials.token && credentials.name) {
        delete credentials.token;
        delete credentials.name;
        delete credentials.authenticator;
      }
      resolve();
      // reject('notification.token_verification.invalidation');
    });
  },

  // trigger every time when user already login, resending the credentials back to the user sesson
  restore (credentials) {
    // if (credentials.authenticated) can be check as well
    return new RSVP.Promise(
      (resolve, reject) => credentials.token && credentials.name ? resolve(credentials) : reject());
  }
});
