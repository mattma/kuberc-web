import Ember from 'ember';
import Notification from 'dashboard/notification/model';
const { service } = Ember.inject;

export default Ember.Service.extend({
  i18n: service(),

  delayedNotifications: Ember.A(),
  content: Ember.A(),
  timeout: 3000,

  pushObject (object) {
    // object can be either a DS.Model or a plain JS object, so when working with it, we need to handle both cases.

    // make sure notifications have all the necessary properties set.
    if (typeof object.toJSON === 'function') {
      // working with a DS.Model

      if (object.get('location') === '') {
        object.set('location', 'bottom');
      }
    } else {
      if (!object.location) {
        object.location = 'bottom';
      }
    }

    this._super(object);
  },

  handleNotification (message, delayed) {
    if (typeof message.toJSON === 'function') {
      // If this is a persistent message from the server, treat it as html safe
      if (message.get('status') === 'persistent') {
        message.set('message', message.get('message').htmlSafe());
      }

      if (!message.get('status')) {
        message.set('status', 'passive');
      }
    } else {
      if (!message.status) {
        message.status = 'passive';
      }
    }

    // message is an object which contains 3 properties: type, message, status
    // translate "message.message" property with "118n" support
    message.message = this.translator(message.message);

    if (!delayed) {
      this.get('content').pushObject(message);
    } else {
      this.delayedNotifications.pushObject(message);
    }
  },

  showAPIError (resp, options={}) {
    this._isClosePassive(options);

    options.defaultErrorText = options.defaultErrorText ||
      'There was a problem on the server, please try again.';

    if (resp) {
      if (resp.responseJSON) {
        this.showError(resp.responseJSON, options);
      } else if (resp.responseText) {
        this.showError(JSON.parse(resp.responseText));
      } else if (resp.message) {
        // It is a simple plain object, which only contains message property
        this.showError(resp.message, options);
      } else {
        console.log('no matches');
      }
    } else {
      this.showError(options.defaultErrorText, {
        doNotClosePassive: true
      });
    }
  },

  showErrors (errors, options={}) {
    this._isClosePassive(options);

    for (var i = 0; i < errors.length; i += 1) {
      this.showError(errors[i].message || errors[i], {
        doNotClosePassive: true
      });
    }
  },

  _showTypeHelper (type, message, options) {
    this._isClosePassive(options);

    let data = {
      type: type,
      message: message
    };
    this.handleNotification(data, options.delayed);
  },

  showError (message, options={}) {
    this._showTypeHelper('error', message, options);
  },

  showInfo (message, options={}) {
    this._showTypeHelper('info', message, options);
  },

  showSuccess (message, options={}) {
    this._showTypeHelper('success', message, options);
  },

  showWarn (message, options={}) {
    this._showTypeHelper('warn', message, options);
  },

  displayDelayed () {
    this.delayedNotifications
      .forEach((message) => this.get('content').pushObject(message));
    this.delayedNotifications = [];
  },

  closeNotification: function(notification) {
    var content = this.get('content');

    if (notification instanceof Notification) {
      notification.deleteRecord();
      notification.save().finally(function() {
        content.removeObject(notification);
      });
    } else {
      content.removeObject(notification);
    }
  },

  _isClosePassive (options) {
    if (!options.doNotClosePassive) {
      this.closePassive();
    }
  },

  closePassive () {
    this.set('content', this.get('content').rejectBy('status', 'passive'));
  },

  closePersistent () {
    this.set('content', this.get('content').rejectBy('status', 'persistent'));
  },

  closeAll () {
    this.get('content').clear();
  },

  translator (msg, i18n=this.get('i18n')) {
    if (!msg) {
      return ;
    }
    if (typeof msg === 'object' && msg.title) {
      return i18n.t(msg.title);
    } else if (typeof msg === 'string') {
      let translator = i18n.t(msg);
      return translator ? translator : msg;
    }
    console.log('@TODO translator special case: ', msg);
    return 'todo';
  }
});
