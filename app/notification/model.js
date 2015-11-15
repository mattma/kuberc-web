import DS from 'ember-data';

export default  DS.Model.extend({
  dismissible: DS.attr('boolean'),
  location:    DS.attr('string'),
  status:      DS.attr('string'),
  type:        DS.attr('string'),
  message:     DS.attr('string')
});
