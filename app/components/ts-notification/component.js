import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['notification'],
  classNameBindings: ['typeClass'],

  notifications: service(),

  message: null,

  didInsertElement () {
    this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.get('notifications').closeNotification(this.get('message'));
      }
    });
  },

  typeClass: Ember.computed(function () {
    const message = this.get('message');
    let classes = '';
    let type;
    let dismissible;

    // Check to see if we're working with a DS.Model or a plain JS object
    if (typeof message.toJSON === 'function') {
      type = message.get('type');
      dismissible = message.get('dismissible');
    } else {
      type = message.type;
      dismissible = message.dismissible;
    }

    classes += type;

    if (type === 'success' && dismissible !== false) {
      classes += ' passive';
    }

    return classes;
  }),

  actions: {
    closeNotification () {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
