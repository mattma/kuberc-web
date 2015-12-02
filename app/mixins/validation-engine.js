import Ember from 'ember';

import {getRequestErrorMessage} from 'dashboard/utils/error-handler';
import ValidatorExtensions from 'dashboard/utils/validator-extensions';

import SignupValidator from 'dashboard/utils/validators/signup';
import SigninValidator from 'dashboard/utils/validators/signin';
import ForgotValidator from 'dashboard/utils/validators/forgotten';
// import SettingValidator from 'dashboard/utils/validators/setting';
import ResetPasswordValidator from 'dashboard/utils/validators/reset-password';
import ActivationValidator from 'dashboard/utils/validators/activation';
// import UserValidator from 'dashboard/utils/validators/user';

// our extensions to the validator library
ValidatorExtensions.init();

// format errors to be used in `notifications.showErrors`.
// result is [{message: 'concatenated error messages'}]
function formatErrors (errors, opts) {
  var message = 'There was an error';

  opts = opts || {};

  if (opts.wasSave && opts.validationType) {
    message += ' saving this ' + opts.validationType;
  }

  if (Ember.isArray(errors)) {
    // get the validator's error messages from the array.
    // normalize array members to map to strings.
    message = errors.map(function (error) {
      if (typeof error === 'string') {
        return error;
      }

      return error.message;
    }).join('<br />');
  } else if (errors instanceof Error) {
    message += errors.message || '.';
  } else if (typeof errors === 'object') {
    // Get messages from server response
    message += ': ' + getRequestErrorMessage(errors, true);
  } else if (typeof errors === 'string') {
    message += ': ' + errors;
  } else {
    message += '.';
  }

  // set format for notifications.showErrors
  message = [{message: message}];

  return message;
}

/**
 * The class that gets this mixin will receive these properties and functions.
 * It will be able to validate any properties on itself (or the model it passes to validate())
 * with the use of a declared validator.
 */
var ValidationEngine = Ember.Mixin.create({
  // these validators can be passed a model to validate when the class that
  // mixes in the ValidationEngine declares a validationType equal to a key on this object.
  // the model is either passed in via `this.validate({ model: object })`
  // or by calling `this.validate()` without the model property.
  // in that case the model will be the class that the ValidationEngine
  // was mixed into, i.e. the controller or Ember Data model.
  validators: {
    signup:           SignupValidator,
    signin:           SigninValidator,
    forgotten: ForgotValidator,
    // setting:   SettingValidator,
    'reset-password': ResetPasswordValidator,
    'activation': ActivationValidator
    // user:      UserValidator
  },

  /**
   * Passses the model to the validator specified by validationType.
   * Returns a promise that will resolve if validation succeeds, and reject if not.
   * Some options can be specified:
   *
   * `format: false` - doesn't use formatErrors to concatenate errors for notifications.showErrors.
   *    will return whatever the specified validator returns.
   *    since notifications are a common usecase, `format` is true by default.
   *
   * `model: Object` - you can specify the model to be validated, rather than pass
   *    the default value of `this`, the class that mixes in this mixin.
   */
  validate (opts) {
    var model = opts.model || this;
    var type = this.get('validationType');
    var validator = this.get('validators.' + type);

    opts = opts || {};
    opts.validationType = type;

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var validationErrors;

      if (!type || !validator) {
        validationErrors = ['The validator specified, "' + type + '", did not exist!'];
      } else {
        validationErrors = validator.check(model);
      }

      if (Ember.isEmpty(validationErrors)) {
        return resolve();
      }

      if (opts.format !== false) {
        validationErrors = formatErrors(validationErrors, opts);
      }
      return reject(validationErrors);
    });
  },

  /**
   * The primary goal of this method is to override the `save` method on Ember Data models.
   * This allows us to run validation before actually trying to save the model to the server.
   * You can supply options to be passed into the `validate` method,
   * since the ED `save` method takes no options.
   */
  save (options) {
    var self = this;
    // this is a hack, but needed for async _super calls.
    // ref: https://github.com/emberjs/ember.js/pull/4301
    var _super = this.__nextSuper;

    options = options || {};
    options.wasSave = true;

    // model.destroyRecord() calls model.save() behind the scenes.
    // in that case, we don't need validation checks or error propagation,
    // because the model itself is being destroyed.
    if (this.get('isDeleted')) {
      return this._super();
    }

    // If validation fails, reject with validation errors.
    // If save to the server fails, reject with server response.
    return this.validate(options).then(function () {
      return _super.call(self, options);
    }).catch(function (result) {
      // server save failed - validate() would have given back an array
      if (!Ember.isArray(result)) {
        if (options.format !== false) {
          // concatenate all errors into an array with a single object:
          // [{message: 'concatted message'}]
          result = formatErrors(result, options);
        } else {
          // return the array of errors from the server
          result = getRequestErrorMessage(result);
        }
      }

      return Ember.RSVP.reject(result);
    });
  }
});

export default ValidationEngine;