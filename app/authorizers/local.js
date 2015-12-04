import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';
const { service } = Ember.inject;
const { isEmpty } = Ember;

// the custom authorizer that authorizes requests against the custom server
export default Base.extend({
  session: service('session'),

  authorize (data, block) {
    const token = data.token;
    const authName = data.name;

    if (!isEmpty(token) && !isEmpty(authName) && this.get('session.isAuthenticated')) {
      block('AuthName', authName);
      block('Authorization', token);
    }
  }
});
