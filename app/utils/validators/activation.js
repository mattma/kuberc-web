import Ember from 'ember';

export default Ember.Object.create({
  check (model) {
    let activation = model.get('verification');
    let validationErrors = [];

    if (!validator.isNumeric(activation)) {
      validationErrors.push({
        message: 'notification.activation.mobile.numeric'
      });
    } else {
      if (!validator.isLength(activation, 4)) {
        validationErrors.push({
          message: 'notification.activation.mobile.length'
        });
      }
    }

    return validationErrors;
  }
});
