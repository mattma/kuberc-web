export default {
  'notification': {
    'jsonapi': 'Client side JSON API formatting error',
    'username': 'Username must be at least 4 characters long',
    'email': 'Invalid email address',
    'phone': 'Invalid telephone number',
    'password': {
      'length': 'Password must be at least 8 characters long',
      'rule': 'Password must contain at least one uppercase letter, ' +
        'one lowercase letter, one number'
    },
    'first_name': 'Please enter a valid first name.',

    // login page
    'login': {
      'pre_login_activation': 'Check your registered email and activate your account',
      'authenticate': 'Incorrect password',
      'authenticateAll': 'Username or Password is not correct'
    },

    'signup': {
      'default': 'User signup failed. Contact admin for details',
      'duplicate': {
        'username': 'Username has already existed in the database',
        'email': 'Email has already existed in the database',
        'phone': 'Phone number has already existed in the database',
        'username/email': 'Username and Email have already existed in the database',
        'username/email/phone': `Username, Email and Phone number
          have already existed in the database`,
        'username/phone': 'Username and Phone number have already existed in the database',
        'email/phone': 'Email and Phone number have already existed in the database'
      },
      'db_error': 'An error occur and it cannot save into database',

      email: {
        'sent': 'Action needed! Check your Email and Activate your account'
      },

      'mobile': {
        'sent': 'Check your message, enter your passcode in the field'
      }
    },

    // browser request, new user registration verification
    'activation': {
      'default': 'Activation failed. Contact admin for details',
      'success': 'Great new! You have successfully activated your account',
      'invalid': 'Activation code is incorrect',
      'invalidOrExpired': 'Activation code is incorrect or already expired',
      'activated': 'The account has not registered or has already activated',

      // mobile request, new user registration verification
      'mobile': {
        'default': 'User data or activation code is incorrect',
        'length': 'Verification code must be at least 4 characters long',
        'numeric': 'Verification code must be numeric',
        'invalidOrExpired': 'Verification code is incorrect or already expired'
      },
    },

    'reset_password': {
      'default': 'Reset Password failed. Please, try again or contact admin',
      'not_found': 'User or Email or Phone number cannot be found',
      'invalid': 'No username or email is being received',
      'success': 'Sent out an reset password instruction. Action needed, check your email',
      'default_completeion': 'Reset Password failed. Please, try again or contact admin',
      'invalidOrExpired': `Reset password code has expired or invalid,
        and use forgotten link for a new code`,
      'code_invalid': 'Reset password code is incorrect',

      'email': {
        'success': 'Successfully changed password, use new password to login'
      },

      'mobile': {
        'new_password': 'Insert mobile verification code and new password',
        'success': 'Successfully changed password, use new password to login'
      }
    },

    'token_verification': {
      'invalidation': 'Session expired, must re-login to see the page',
      'unauthorized': 'Unauthorized to see this page',
      'success_clear_token': 'You have successfully logged out. Please, log back in soon',
      'require_login': 'You must login to see this page'
    },

    'friends': {
      'checking_status': {
        'default': 'Encounted a problem when validate friend status',
        'missing': 'No username or email in the request',
        'linked': '{{requester}} and you are already linked as a friend.'
      },

      'linking': {
        'default': 'Something went wrong when add a friend'
      }
    }
  }
};
