import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  dismissible: attr('boolean'),
  location:    attr('string'),
  status:      attr('string'),
  type:        attr('string'),
  message:     attr('string')
});
