import Ember from 'ember';

export default Ember.Object.create({
  check (model) {
    let username = model.get('userid');
    let validationErrors = [];

    // notification.username is coming from 'i18n' in "app/locales"
    if (!validator.isLength(username, 4)) {
      validationErrors.push({
        message: 'notification.username'
      });
    } else {
      if(username.indexOf('@') > -1) {
        if (!validator.isEmail(username)) {
          validationErrors.push({
            message: 'notification.email'
          });
        }
      }
    }

    return validationErrors;
  }
});
