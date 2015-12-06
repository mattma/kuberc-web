import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  dismissible: attr('boolean'),
  status:      attr('string'),
  type:        attr('string'),
  message:     attr('string')
});
