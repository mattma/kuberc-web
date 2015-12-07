import Ember from 'ember';
// start-non-standard
import computed from 'ember-computed-decorators';
// end-non-standard
const {Component, inject} = Ember;

export default Component.extend({
  notifications: inject.service(),

  classNames: ['alert'],
  classNameBindings: ['typeClass'],

  // start-non-standard
  @computed('message.type')
  // end-non-standard
  typeClass (type) {
    let classes = '';
    let typeMapping = {
      success: 'success',
      error: 'error',
      warn: 'warn',
      info: 'info',
      'alert-dark': 'alert-dark'
    };

    if (typeMapping[type] !== undefined) {
      classes += `${typeMapping[type]}`;
    }

    return classes;
  },

  actions: {
    // close each message that is being clicked on
    closeNotification () {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
