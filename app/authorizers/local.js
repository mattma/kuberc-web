import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';
const { service } = Ember.inject;
const { isEmpty } = Ember;

// the custom authorizer that authorizes requests against the custom server
export default Base.extend({
  session: service('session'),

  authorize (data, block) {
    const isAuthenticated = this.get('session.isAuthenticated');
    const token = data.token;
    const authName = data.name;

    if (isAuthenticated && !isEmpty(token) && !isEmpty(authName)) {
      block('AuthName', authName);
      block('Authorization', token);
    }
  }
});
