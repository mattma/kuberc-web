import DS from 'ember-data';

// http://emberjs.com/guides/models/defining-models/
let attr = DS.attr;

export default DS.Model.extend({
  type: 'users',
  username: attr('string'),
  email: attr('string'),
  password: attr('string'),
  phone: attr('string'),
  firstName: attr('string')
});
