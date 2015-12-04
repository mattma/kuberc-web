import Ember from 'ember';
const {isBlank} = Ember;

function init () {
  // Provide a few custom validators
  validator.extend('empty', str => isBlank(str));

  validator.extend('notContains', (str, badString) => str.indexOf(badString) === -1);
}

export default {
  init: init
};
