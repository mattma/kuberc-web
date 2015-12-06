import validator from 'validator';

// put `password` at the end, so that we could add another verify password field or other fields in the future without breaking the flow
export default function PasswordValidator (model, password) {
  if (validator.empty(password) || !validator.isLength(password, 8)) {
    model.get('errors').add('password', 'notification.password.length');
    this.invalidate();
  } else {
    let hasUpperCase = true;
    let hasLowerCase = true;
    let hasNumbers = true;

    // doing more crazy password strength checking
    // Need to have at least one uppercase letter
    if (!validator.matches(password, /[A-Z]/)) {
      hasUpperCase = false;
    }
    // Need to have at least one lowercase letter
    if (!validator.matches(password, /[a-z]/)) {
      hasLowerCase = false;
    }
    // Need to have at least one number
    if (!validator.matches(password, /[\d]/)) {
      hasNumbers = false;
    }
    // Need to have at least one special character
    // new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      model.get('errors').add('password', 'notification.password.rule');
      this.invalidate();
    }
  }
}
