import Ember from 'ember';
import styleBody from 'dashboard/mixins/style-body';

export default Ember.Route.extend(styleBody, {
  classNames: ['page', 'forgotten']
});
