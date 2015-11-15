import Ember from 'ember';
import passwordValidator from 'dashboard/utils/validators/helpers/password-helper';

export default Ember.Object.create({
  check (model) {
    let data = model.getProperties('verification', 'password');
    let validationErrors = [];

    // verification is ONLY available in Mobile request
    if (data.verification) {
      if (!validator.isNumeric(data.verification)) {
        validationErrors.push({
          message: 'notification.activation.mobile.numeric'
        });
      } else {
        if (!validator.isLength(data.verification, 4)) {
          validationErrors.push({
            message: 'notification.activation.mobile.length'
          });
        }
      }
    }

    passwordValidator(validationErrors, data.password);

    return validationErrors;
  }
});
