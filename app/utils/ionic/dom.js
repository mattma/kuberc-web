/**
* @doc utility
* @name DomUtil
*/
let DomUtil = {
  /**
   * Since we moved `readyCallbacks` to `init.js`, we have to attach it to the
   * DomUtil itself to support this feature
   */
  readyCallbacks: [],

  isDomReady: document.readyState === 'complete' || document.readyState === 'interactive',

  /**
   * @name DomUtil#requestAnimationFrame
   * @description Calls requestAnimationFrame
   * https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
   * or a polyfill if not available.
   * `_rAF()` method is defined at `/public/assets/js/mobile-init.js`
   * @param {function} callback The function to call when the next frame happens.
   */
  requestAnimationFrame (cb) {
    return window._rAF(cb);
  },

  cancelAnimationFrame (requestId) {
    const _cAF = window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame;

    _cAF(requestId);
  },

  /**
   * @name DomUtil#animationFrameThrottle
   * @description
   * When given a callback, if that callback is called 100 times between
   * animation frames, adding Throttle will make it only run the last of
   * the 100 calls.
   *
   * @param {function} callback a function which will be throttled to
   * requestAnimationFrame
   * @returns {function} A function which will then call the passed in callback.
   * The passed in callback will receive the context the returned function is
   * called with.
   */
  animationFrameThrottle (cb) {
    let args;
    let isQueued;
    let context;
    return function() {
      args = arguments;
      context = this;
      if (!isQueued) {
        isQueued = true;
        DomUtil.requestAnimationFrame(() => {
          cb.apply(context, args);
          isQueued = false;
        });
      }
    };
  },

  contains (parentNode, otherNode) {
    let current = otherNode;
    while (current) {
      if (current === parentNode) {
        return true;
      }
      current = current.parentNode;
    }
  },

  /**
   * @ngdoc method
   * @name DomUtil#getPositionInParent
   * @description
   * Find an element's scroll offset within its container.
   * @param {DOMElement} element The element to find the offset of.
   * @returns {object} A position object with the following properties:
   *   - `{number}` `left` The left offset of the element.
   *   - `{number}` `top` The top offset of the element.
   */
  getPositionInParent (el) {
    return {
      left: el.offsetLeft,
      top: el.offsetTop
    };
  },

  /**
   * @name DomUtil#ready
   * @description
   * Call a function when the DOM is ready, or if it is already ready
   * call the function immediately.
   * @param {function} callback The function to be called.
   */
  ready (cb) {
    if (DomUtil.isDomReady) {
      DomUtil.requestAnimationFrame(cb);
    } else {
      DomUtil.readyCallbacks.push(cb);
    }
  },

  /**
   * @name DomUtil#getTextBounds
   * @description
   * Get a rect representing the bounds of the given textNode.
   * @param {DOMElement} textNode The textNode to find the bounds of.
   * @returns {object} An object representing the bounds of the node. Properties:
   *   - `{number}` `left` The left position of the textNode.
   *   - `{number}` `right` The right position of the textNode.
   *   - `{number}` `top` The top position of the textNode.
   *   - `{number}` `bottom` The bottom position of the textNode.
   *   - `{number}` `width` The width of the textNode.
   *   - `{number}` `height` The height of the textNode.
   */
  getTextBounds (textNode) {
    if (document.createRange) {
      let range = document.createRange();
      range.selectNodeContents(textNode);

      if (range.getBoundingClientRect) {
        const rect = range.getBoundingClientRect();
        if (rect) {
          const sx = window.scrollX;
          const sy = window.scrollY;

          return {
            top: rect.top + sy,
            left: rect.left + sx,
            right: rect.left + sx + rect.width,
            bottom: rect.top + sy + rect.height,
            width: rect.width,
            height: rect.height
          };
        }
      }
    }
    return null;
  },

  /**
   * @name DomUtil#getChildIndex
   * @description
   * Get the first index of a child node within the given element of the
   * specified type.
   * @param {DOMElement} element The element to find the index of.
   * @param {string} type The nodeName to match children of element against.
   * @returns {number} The index, or -1, of a child with nodeName matching type.
   */
  getChildIndex (element, type) {
    if (type) {
      const ch = element.parentNode.children;
      let c;

      for (let i = 0, k = 0, j = ch.length; i < j; i++) {
        c = ch[i];
        if (c.nodeName && c.nodeName.toLowerCase() === type) {
          if (c === element) {
            return k;
          }
          k++;
        }
      }
    }
    return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
  },

  /**
   * @private
   */
  swapNodes (src, dest) {
    dest.parentNode.insertBefore(src, dest);
  },

  elementIsDescendant (el, parent, stopAt) {
    let current = el;

    do {
      if (current === parent) {
        return true;
      }
      current = current.parentNode;
    } while (current && current !== stopAt);

    return false;
  },

  /**
   * @name DomUtil#getParentWithClass
   * @param {DOMElement} element
   * @param {string} className
   * @returns {DOMElement} The closest parent of element matching the
   * className, or null.
   */
  getParentWithClass (e, className, depth) {
    depth = depth || 10;

    while (e.parentNode && depth--) {
      if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
        return e.parentNode;
      }
      e = e.parentNode;
    }
    return null;
  },

  /**
   * @name DomUtil#getParentOrSelfWithClass
   * @param {DOMElement} element
   * @param {string} className
   * @returns {DOMElement} The closest parent or self matching the
   * className, or null.
   */
  getParentOrSelfWithClass (e, className, depth) {
    depth = depth || 10;
    while (e && depth--) {
      if (e.classList && e.classList.contains(className)) {
        return e;
      }
      e = e.parentNode;
    }
    return null;
  },

  /**
   * @name DomUtil#rectContains
   * @param {number} x
   * @param {number} y
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {boolean} Whether {x,y} fits within the rectangle defined by
   * {x1,y1,x2,y2}.
   */
  rectContains (x, y, x1, y1, x2, y2) {
    if (x < x1 || x > x2) {
      return false;
    }
    if (y < y1 || y > y2) {
      return false;
    }
    return true;
  },

  /**
   * @name DomUtil#blurAll
   * @description
   * Blurs any currently focused input element
   * @returns {DOMElement} The element blurred or null
   */
  blurAll () {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
      return document.activeElement;
    }
    return null;
  }
};

export default DomUtil;
