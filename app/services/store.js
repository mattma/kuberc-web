import DS from 'ember-data';
import ApplicationAdapter from 'dashboard/application/adapter';

export default DS.Store.extend({
  adapter: ApplicationAdapter
});
