import Ember from 'ember';
import computed from 'ember-computed-decorators';
const {Component, inject} = Ember;

export default Component.extend({
  notifications: inject.service(),

  classNames: ['alert'],
  classNameBindings: ['typeClass'],

  @computed('message.type')
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
