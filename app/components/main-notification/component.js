import Ember from 'ember';
// start-non-standard
import computed from 'ember-computed-decorators';
// end-non-standard
const {Component, inject} = Ember;

export default Component.extend({
  notifications: inject.service(),

  classNames: ['notification', 'passive'],
  classNameBindings: ['typeClass'],

  message: null,

  didInsertElement () {
    this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.get('notifications').closeNotification(this.get('message'));
      }
    });
  },

  willDestroyElement() {
   this.$().off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
  },

  // start-non-standard
  @computed('message.type')
  // end-non-standard
  typeClass (type) {
    let classes = '';
    let typeMapping = {
      success: 'success',
      error: 'error',
      warn: 'warn'
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
