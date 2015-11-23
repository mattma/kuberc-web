import Ember from 'ember';
import AuthenticatedRoute from 'dashboard/mixins/routes/authenticated';
const { service } = Ember.inject;

export default AuthenticatedRoute.extend({
  session: service('session'),

  afterModel (model, transition) {
    if (Ember.canInvoke(transition, 'send')) {
      transition.abort();
    }

    this.get('session').invalidate();
  }
});
