import Ember from 'ember';

const {Service, inject, get, set} = Ember;
import {filter} from 'ember-computed-decorators';
const emberA = Ember.A;

// Notification keys take the form of "noun.verb.message", eg:
//
// "invite.resend.api-error"
// "user.invite.already-invited"
//
// The "noun.verb" part will be used as the "key base" in duplicate checks
// to avoid stacking of multiple error messages whilst leaving enough
// specificity to re-use keys for i18n lookups

export default Service.extend({
  i18n: inject.service(),

  delayedNotifications: emberA(),
  content: emberA(),

  @filter('content', function (notification) {
    return get(notification, 'status') === 'alert';
  }) alerts,

  @filter('content', function (notification) {
    return get(notification, 'status') === 'notification';
  }) notifications,

  handleNotification (message, delayed) {
    // If this is an alert message from the server, treat it as html safe
    if (typeof message.toJSON === 'function' && message.get('status') === 'alert') {
      message.set('message', message.get('message').htmlSafe());
    }

    if (!get(message, 'status')) {
      set(message, 'status', 'notification');
    }

    // message is an object which contains 3 properties: type, message, status
    // translate "message.message" property with "118n" support
    message.message = this.translator(message.message);

    if (!delayed) {
      this.get('content').pushObject(message);
    } else {
      this.get('delayedNotifications').pushObject(message);
    }
  },

  showAlert (message, options={}) {
    this.handleNotification({
      message,
      status: 'alert',
      type: options.type
    }, options.delayed);
  },

  showNotification (message, options={}) {
    if (!options.doNotCloseNotifications) {
      this.closeNotifications();
    }

    this.handleNotification({
      message,
      status: 'notification',
      type: options.type
    }, options.delayed);
  },

  showErrors (errors, options={}) {
    if (!options.doNotCloseNotifications) {
      this.closeNotifications();
    }

    // ensure all errors that are passed in get shown
    options.doNotCloseNotifications = true;
    options.type = 'error';

    if (options.kind === 'api') {
      this.showNotification(errors.title, options);
    } else {
      const messages = errors.get("messages");
      const len = errors.get("length");

      for (let i = 0; i < len; i++) {
        this.showNotification(messages[i], options);
      }
    }
  },

  showAPIError (resp, options={}) {
    options.kind = "api";

    options.defaultErrorText = options.defaultErrorText || 'There was a problem on the server, please try again.';

    if (resp) {
      if (resp.responseJSON) {
        this.showErrors(resp.responseJSON, options);
      } else if (resp.responseText) {
        this.showErrors(JSON.parse(resp.responseText), options);
      } else if (resp.message) {
        // It is a simple plain object, which only contains message property
        this.showErrors(resp.message, options);
      } else {
        console.log('no matches');
      }
    } else {
      this.showErrors(options.defaultErrorText, {
        doNotClosePassive: true
      });
    }
  },

  displayDelayed () {
    this.delayedNotifications.forEach((message) => {
      this.get('content').pushObject(message);
    });
    this.delayedNotifications = [];
  },

  closeNotification (notification) {
    let content = this.get('content');

    if (typeof notification.toJSON === 'function') {
      notification.deleteRecord();
      notification.save().finally(() => {
        content.removeObject(notification);
      });
    } else {
      content.removeObject(notification);
    }
  },

  closeNotifications (key) {
    this._removeItems('notification', key);
  },

  closeAlerts (key) {
    this._removeItems('alert', key);
  },

  clearAll () {
    this.get('content').clear();
  },

  _removeItems (status, key) {
    if (key) {
      let keyBase = this._getKeyBase(key);
      // TODO: keys should only have . special char but we should
      // probably use a better regexp escaping function/polyfill
      let escapedKeyBase = keyBase.replace('.', '\\.');
      let keyRegex = new RegExp(`^${escapedKeyBase}`);

      this.set('content', this.get('content').reject((item) => {
        let itemKey = get(item, 'key');
        let itemStatus = get(item, 'status');

        return itemStatus === status && (itemKey && itemKey.match(keyRegex));
      }));
    } else {
      this.set('content', this.get('content').rejectBy('status', status));
    }
  },

  // take a key and return the first two elements, eg:
  // "invite.revoke.failed" => "invite.revoke"
  _getKeyBase (key) {
    return key.split('.').slice(0, 2).join('.');
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
