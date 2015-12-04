import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import styleBody from 'dashboard/mixins/style-body';

export default Ember.Route.extend(AuthenticatedRouteMixin, styleBody);
