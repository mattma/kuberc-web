import Ember from 'ember';
import passwordValidator from 'dashboard/utils/validators/helpers/password-helper';

export default Ember.Object.create({
  check (model) {
    let data = model.getProperties('identification', 'password');
    let validationErrors = [];

    if (!validator.isLength(data.identification, 4)) {
      validationErrors.push({
        message: 'notification.username'
      });
    }

    passwordValidator(validationErrors, data.password);

    return validationErrors;
  }
});
