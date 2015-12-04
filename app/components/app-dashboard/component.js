import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  sess: service('session-account'),

  classNames: ['page-dashboard'],

  @alias('sess.sessionUser.content') sessionUser
});
