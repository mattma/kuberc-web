import Ember from 'ember';
import computed from 'ember-computed-decorators';
const { service } = Ember.inject;

export default Ember.Component.extend({
  notifications: service(),

  classNames: ['notification'],
  classNameBindings: ['typeClass'],

  message: null,

  didInsertElement () {
    this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.get('notifications').closeNotification(this.get('message'));
      }
    });
  },

  @computed
  typeClass () {
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

    if (type === 'success' && dismissible !== false) {
      classes += ` passive`;
    }

    return `${type}${classes}`;
  },

  actions: {
    closeNotification () {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
