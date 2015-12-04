import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  type: 'users',
  username: attr('string'),
  email: attr('string'),
  password: attr('string'),
  phone: attr('string'),
  firstName: attr('string')
});
