import Gesture from 'ts/utils/ionic/gestures';

/**
* Framework events handles various mobile browser events, and
* detects special events like tap/swipe/etc. and emits them
* as custom events that can be used in an app.
*
* Portions lovingly adapted from
* github.com/maker/ratchet and github.com/alexgibson/tap.js
*/

/**
 * @ngdoc utility
 * @name EventController
 */
let EventController = {
  VIRTUALIZED_EVENTS: [
    'tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'
  ],

  /**
   * @name EventController#trigger
   * @param {string} eventType The event to trigger.
   * @param {object} data The data for the event. Hint: pass in
   * `{target: targetElement}`
   * @param {boolean=} bubbles Whether the event should bubble up the DOM.
   * @param {boolean=} cancelable Whether the event should be cancelable.
   */
  // Trigger a new event
  trigger (eventType, data, bubbles, cancelable) {
    const event = new window.CustomEventBus(eventType, {
      detail: data,
      bubbles: !!bubbles,
      cancelable: !!cancelable
    });

    // Make sure to trigger the event on the given target, or dispatch it from
    // the window if we don't have an event target
    if (data && data.target && data.target.dispatchEvent) {
      data.target.dispatchEvent(event);
    } else if (window.dispatchEvent) {
      window.dispatchEvent(event);
    }
  },

  /**
   * @name EventController#on
   * @description Listen to an event on an element.
   * @param {string} type The event to listen for.
   * @param {function} callback The listener to be called.
   * @param {DOMElement} element The element to listen for the event on.
   */
  on (type, callback, element) {
    let e = element || window;

    // Bind a gesture if it's a virtual event
    for(let i = 0, j = EventController.VIRTUALIZED_EVENTS.length; i < j; i++) {
      if (type === EventController.VIRTUALIZED_EVENTS[i]) {
        let gesture = new Gesture(element);
        gesture.on(type, callback);
        return gesture;
      }
    }

    // Otherwise bind a normal event
    e.addEventListener(type, callback);
  },

  /**
   * @name EventController#off
   * @description Remove an event listener.
   * @param {string} type
   * @param {function} callback
   * @param {DOMElement} element
   */
  off (type, callback, element) {
    element.removeEventListener(type, callback);
  },

  /**
   * @name EventController#onGesture
   * @description Add an event listener for a gesture on an element.
   *
   * Available eventTypes (from [hammer.js](http://eightmedia.github.io/hammer.js/)):
   *
   * `hold`, `tap`, `doubletap`, `drag`, `dragstart`, `dragend`, `dragup`, `dragdown`,
   * `dragleft`, `dragright`, `swipe`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`,
   * `transform`, `transformstart`, `transformend`, `rotate`, `pinch`, `pinchin`,
   * `pinchout`, `touch`, `release`
   *
   * @param {string} eventType The gesture event to listen for.
   * @param {function(e)} callback The function to call when the gesture
   * happens.
   * @param {DOMElement} element The angular element to listen for the event on.
   * @param {object} options object.
   * @returns {Gesture} The gesture object (use this to remove the gesture later on).
   */
  onGesture (type, callback, element, options) {
    let gesture = new Gesture(element, options);
    gesture.on(type, callback);
    return gesture;
  },

  /**
   * @ngdoc method
   * @name EventController#offGesture
   * @description Remove an event listener for a gesture created on an element.
   * @param {Gesture} gesture The gesture that should be removed.
   * @param {string} eventType The gesture event to remove the listener for.
   * @param {function(e)} callback The listener to remove.
   */
  offGesture (gesture, type, callback) {
    if (gesture && gesture.off) {
      gesture.off(type, callback);
    }
  },

  handlePopState() {}
};

export default EventController;
