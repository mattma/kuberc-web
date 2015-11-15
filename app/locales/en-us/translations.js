import $ from 'jquery';
import form from './-form';
import nav from './-nav';
import notification from './-notification';
import page_login from './-page-login';
import page_signup from './-page-signup';
import page_forgotten from './-page-forgotten';
import page_reset_password from './-page-reset-password';
import dashboard from './-page-dashboard';
import friends from './-page-friends';
import page_me from './-page-me';
import page_setting from './-page-setting';
import page_verification from './-page-verification';
import page_intro from './-page-intro';

import user_card from './-comp-user-card';

let root = {
  'todo': '@TODO',
  'button-back': 'Back'
};

export default $.extend(root,
  form, nav, notification,
  page_login, page_signup, page_forgotten, page_reset_password, dashboard,
  page_me, page_setting, page_verification, page_intro,
  friends, user_card
);

// "some.translation.key": "Text for some.translation.key",
//
// "a": {
//   "nested": {
//     "key": "Text for a.nested.key"
//   }
// },
//
// "key.with.interpolation": "Text with {{anInterpolation}}"
