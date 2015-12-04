import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  sess: service('session-account'),

  // s: an object contains current login user info
  @alias('sess.sessionUser.content') s
});
