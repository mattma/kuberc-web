import BaseValidator from './base';
import validator from 'validator';
import passwordValidator from 'dashboard/utils/validators/helpers/password-helper';

export default BaseValidator.create({
  properties: ['login'],

  // function name should match `properties` array name
  // defined at `base.js` via `this[property](model)`
  login (model) {
    const data = model.getProperties('identification', 'password');

    if (validator.empty(data.identification) || !validator.isLength(data.identification, 4)) {
      model.get('errors').add('identification', 'notification.username');
      this.invalidate();
    }

    passwordValidator(model, data.password);
  }
});
