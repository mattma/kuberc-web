import Ember from 'ember';
import DS from 'ember-data';

import getRequestErrorMessage from 'dashboard/utils/error-handler';
import ValidatorExtensions from 'dashboard/utils/validator-extensions';

// import SignupValidator from 'dashboard/utils/validators/signup';
import loginValidator from 'dashboard/utils/validators/login';
// import ForgotValidator from 'dashboard/utils/validators/forgotten';
// import SettingValidator from 'dashboard/utils/validators/setting';
// import ResetPasswordValidator from 'dashboard/utils/validators/reset-password';
// import ActivationValidator from 'dashboard/utils/validators/activation';
// import UserValidator from 'dashboard/utils/validators/user';

const {Mixin, RSVP, isArray} = Ember;
const {Errors, Model} = DS;
const emberA = Ember.A;

// our extensions to the validator library
ValidatorExtensions.init();

/**
* The class that gets this mixin will receive these properties and functions.
* It will be able to validate any properties on itself (or the model it passes to validate())
* with the use of a declared validator.
*/
export default Mixin.create({
  // these validators can be passed a model to validate when the class that
  // mixes in the ValidationEngine declares a validationType equal to a key on this object.
  // the model is either passed in via `this.validate({ model: object })`
  // or by calling `this.validate()` without the model property.
  // in that case the model will be the class that the ValidationEngine
  // was mixed into, i.e. the controller or Ember Data model.
  validators: {
    // signup: SignupValidator,
    login: loginValidator
    // forgotten: ForgotValidator,
    // setting: SettingValidator,
    // 'reset-password': ResetPasswordValidator,
    // 'activation': ActivationValidator
    // user: UserValidator
  },

  // This adds the Errors object to the validation engine, and shouldn't affect
  // ember-data models because they essentially use the same thing
  errors: Errors.create(),

  // Store whether a property has been validated yet, so that we know whether or not to show error / success validation for a field
  hasValidated: emberA(),

  /**
  * Passes the model to the validator specified by validationType.
  * Returns a promise that will resolve if validation succeeds, and reject if not.
  * Some options can be specified:
  *
  * `model: Object` - you can specify the model to be validated, rather than pass the default value of `this`,
  *                   the class that mixes in this mixin.
  *
  * `property: String` - you can specify a specific property to validate. If
  *              no property is specified, the entire model will be
  *              validated
  */

  validate(opts={}) {
    let model = this;
    let hasValidated;
    // `validationType` passed from each component, property of `validationType`. ex: "login"
    let type;
    // store what is inside `validators` maps property
    let validator;

    if (opts.model) {
      model = opts.model;
    } else if (this instanceof Model) {
      model = this;
    } else if (this.get('model')) {
      model = this.get('model');
    }

    type = this.get('validationType') || model.get('validationType');
    validator = this.get(`validators.${type}`) || model.get(`validators.${type}`);
    hasValidated = this.get('hasValidated');

    opts.validationType = type;

    return new RSVP.Promise((resolve, reject) => {
      let passed;

      if (!type || !validator) {
        return reject([`The validator specified, "${type}", did not exist!`]);
      }

      // General cleanup error queue, ready to run through validation logic
      if (opts.property) {
        // If property isn't in `hasValidated`, add it to mark that this field can show a validation result
        hasValidated.addObject(opts.property);
        // http://emberjs.com/api/data/classes/DS.Errors.html#method_remove
        model.get('errors').remove(opts.property);
      } else {
        // http://emberjs.com/api/data/classes/DS.Errors.html#method_clear
        model.get('errors').clear();
      }

      // called `utils/validators/base#check method`
      passed = validator.check(model, opts.property);

      return (passed) ? resolve() : reject();
    });
  },

  /**
  * The primary goal of this method is to override the `save` method on Ember Data models.
  * This allows us to run validation before actually trying to save the model to the server.
  * You can supply options to be passed into the `validate` method, since the ED `save` method takes no options.
  */
  save(options={}) {
    let {_super} = this;

    options.wasSave = true;

    // model.destroyRecord() calls model.save() behind the scenes.
    // in that case, we don't need validation checks or error propagation,
    // because the model itself is being destroyed.
    if (this.get('isDeleted')) {
      return this._super(...arguments);
    }

    // If validation fails, reject with validation errors.
    // If save to the server fails, reject with server response.
    return this.validate(options).then(() => {
      return _super.call(this, options);
    }).catch((result) => {
      // server save failed or validator type doesn't exist
      if (result && !isArray(result)) {
        // return the array of errors from the server
        result = getRequestErrorMessage(result);
      }

      return RSVP.reject(result);
    });
  },

  actions: {
    validate(property) {
      this.validate({property});
    }
  }
});
