import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['notification'],
  classNameBindings: ['typeClass'],

  message: null,

  notifications: Ember.inject.service(),

  typeClass: Ember.computed(function () {
    var classes = '';
    var message = this.get('message');
    var type;
    var dismissible;

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

  didInsertElement: function () {
    this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.get('notifications').closeNotification(this.get('message'));
      }
    });
  },

  actions: {
    closeNotification: function () {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
