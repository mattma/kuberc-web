/**
 * Some of these are adopted from underscore.js and backbone.js
 * both also MIT licensed.
 */
let Utils = {
  arrayMove (arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      var k = newIndex - arr.length;
      while ((k--) + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  },

  /**
   * Return a function that will be called with the given context
   */
  proxy (func, context) {
    let args = Array.prototype.slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
    };
  },

  /**
   * Only call a function once in the given interval.
   *
   * @param func {Function} the function to call
   * @param wait {int} how long to wait before/after to allow function calls
   * @param immediate {boolean} whether to call immediately or after the wait interval
   */
   debounce (func, wait, immediate) {
    let timeout;
    let args;
    let context;
    let timestamp;
    let result;

    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();

      let later = function() {
        let last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
          }
        }
      };
      let callNow = immediate && !timeout;

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }

      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  },

  /**
   * Throttle the given fun, only allowing it to be
   * called at most every `wait` ms.
   */
  throttle (func, wait, options={}) {
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;

    let later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
    };

    return function() {
      let now = Date.now();
      if (!previous && options.leading === false) {
        previous = now;
      }

      let remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },

   // Borrowed from Backbone.js's extend
   // Helper function to correctly set up the prototype chain, for subclasses.
   // Similar to `goog.inherits`, but uses a hash of prototype properties and
   // class properties to be extended.
  inherit (protoProps, staticProps) {
    let parent = this;
    let child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function() {
        return parent.apply(this, arguments);
      };
    }

    // Add static properties to the constructor function, if supplied.
    Utils.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    let Surrogate = function() {
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
      Utils.extend(child.prototype, protoProps);
    }

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;
    return child;
  },

  // Extend adapted from Underscore.js
  extend (obj) {
    let args = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < args.length; i++) {
      let source = args[i];
      if (source) {
        for (let prop in source) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};

export default Utils;
