import Ember from 'ember';
import passwordValidator from 'dashboard/utils/validators/helpers/password-helper';
import config from '../../../config/environment';

export default Ember.Object.extend({
  check (model) {
    let data = model.getProperties('username', 'email', 'password', 'phone', 'firstName');
    let validationErrors = [];

    if (!validator.isLength(data.username, 4)) {
      validationErrors.push({
        message: 'notification.username'
      });
    }

    passwordValidator(validationErrors, data.password);

    const currentLocale = config.i18n.defaultLocale;
    let locale;
    switch (currentLocale) {
      // @TODO: Matt
      // currently only work in US, comment out once it is real
      // case 'zh-cn':
      //   locale = 'zh-CN';
      //   break;
      case 'en-us':
        locale = 'en-US';
        break;
      default:
        locale = 'en-US';
    }

    // mobile request, does not contain email field
    // browser request, does not contain phone field
    if (config.isMobileRequest) {
      if (!validator.isMobilePhone(data.phone, locale)) {
        validationErrors.push({message: 'notification.phone'});
      }
    } else {
      if (data.email && !validator.isEmail(data.email)) {
        validationErrors.push({message: 'notification.email'});
      }
    }

    if (!validator.isLength(data.firstName, 1)) {
      validationErrors.push({
        message: 'notification.first_name'
      });
    }

    return validationErrors;
  }
});
