import Ember from 'ember';
import computed from 'ember-computed-decorators';
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

  @computed('message.type')
  typeClass (type) {
    let classes = '';
    let typeMapping = {
      success: 'green',
      error: 'red',
      warn: 'yellow'
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
