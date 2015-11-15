import Activator from 'ts/utils/ionic/activator';
import Platform from 'ts/utils/ionic/platform';
import DomUtil from 'ts/utils/ionic/dom';
import Scroll from 'ts/utils/ionic/scroll';
import Events from 'ts/utils/ionic/events';
import Keyboard from 'ts/utils/ionic/keyboard';

/**
 * @ngdoc page
 * @name tap
 * @description
 * On touch devices such as a phone or tablet, some browsers implement a 300ms delay between
 * the time the user stops touching the display and the moment the browser executes the
 * click. This delay was initially introduced so the browser can know whether the user wants to
 * double-tap to zoom in on the webpage. Basically, the browser waits roughly 300ms to see if
 * the user is double-tapping, or just tapping on the display once.
 *
 * Out of the box, Ionic automatically removes the 300ms delay in order to make Ionic apps
 * feel more "native" like. Resultingly, other solutions such as
 * [fastclick](https://github.com/ftlabs/fastclick) should not be included, to avoid conflicts.
 *
 * Some browsers already remove the delay with certain settings, such as the CSS property
 * `touch-events: none` or with specific meta tag viewport values. However, each of these
 * browsers still handle clicks differently, such as when to fire off or cancel the event
 * (like scrolling when the target is a button, or holding a button down).
 * For browsers that already remove the 300ms delay, consider Ionic's tap system as a way to
 * normalize how clicks are handled across the various devices so there's an expected response
 * no matter what the device, platform or version. Additionally, Ionic will prevent
 * ghostclicks which even browsers that remove the delay still experience.
 *
 * In some cases, third-party libraries may also be working with touch events which can interfere
 * with the tap system. For example, mapping libraries like Google or Leaflet Maps often implement
 * a touch detection system which conflicts with Ionic's tap system.
 *
 * ### Disabling the tap system
 *
 * To disable the tap for an element and all of its children elements,
 * add the attribute `data-tap-disabled="true"`.
 *
 * ```html
 * <div data-tap-disabled="true">
 *     <div id="google-map"></div>
 * </div>
 * ```
 *
 * ### Additional Notes:
 *
 * - Ionic tap  works with Ionic's JavaScript scrolling
 * - Elements can come and go from the DOM and Ionic tap doesn't keep adding and removing
 *   listeners
 * - No "tap delay" after the first "tap" (you can tap as fast as you want, they all click)
 * - Minimal events listeners, only being added to document
 * - Correct focus in/out on each input type (select, textearea, range) on each platform/device
 * - Shows and hides virtual keyboard correctly for each platform/device
 * - Works with labels surrounding inputs
 * - Does not fire off a click if the user moves the pointer too far
 * - Adds and removes an 'activated' css class
 * - Multiple [unit tests]
 * (https://github.com/driftyco/ionic/blob/master/test/unit/utils/tap.unit.js) for each scenario
 *
 */
/*

 IONIC TAP
 ---------------
 - Both touch and mouse events are added to the document.body on DOM ready
 - If a touch event happens, it does not use mouse event listeners
 - On touchend, if the distance between start and end was small, trigger a click
 - In the triggered click event, add a 'isIonicTap' property
 - The triggered click receives the same x,y coordinates as as the end event
 - On document.body click listener (with useCapture=true), only allow clicks with 'isIonicTap'
 - Triggering clicks with mouse events work the same as touch, except with mousedown/mouseup
 - Tapping inputs is disabled during scrolling
*/

let tapDoc; // the element which the listeners are on (document.body)
let tapActiveEle; // the element which is active (probably has focus)
let tapEnabledTouchEvents;
let tapMouseResetTimer;
let tapPointerMoved;
let tapPointerStart;
let tapTouchFocusedInput;
let tapLastTouchTarget;
let tapTouchMoveListener = 'touchmove';

// how much the coordinates can be off between start/end, but still a click
let TAP_RELEASE_TOLERANCE = 12; // default tolerance
let TAP_RELEASE_BUTTON_TOLERANCE = 50; // button elements should have a larger tolerance

let tapEventListeners = {
  'click': tapClickGateKeeper,

  'mousedown': tapMouseDown,
  'mouseup': tapMouseUp,
  'mousemove': tapMouseMove,

  'touchstart': tapTouchStart,
  'touchend': tapTouchEnd,
  'touchcancel': tapTouchCancel,
  'touchmove': tapTouchMove,

  'pointerdown': tapTouchStart,
  'pointerup': tapTouchEnd,
  'pointercancel': tapTouchCancel,
  'pointermove': tapTouchMove,

  'MSPointerDown': tapTouchStart,
  'MSPointerUp': tapTouchEnd,
  'MSPointerCancel': tapTouchCancel,
  'MSPointerMove': tapTouchMove,

  'focusin': tapFocusIn,
  'focusout': tapFocusOut
};

let Tap = {
  register: function(ele) {
    tapDoc = ele;

    tapEventListener('click', true, true);
    tapEventListener('mouseup');
    tapEventListener('mousedown');

    if (window.navigator.pointerEnabled) {
      tapEventListener('pointerdown');
      tapEventListener('pointerup');
      tapEventListener('pointcancel');
      tapTouchMoveListener = 'pointermove';

    } else if (window.navigator.msPointerEnabled) {
      tapEventListener('MSPointerDown');
      tapEventListener('MSPointerUp');
      tapEventListener('MSPointerCancel');
      tapTouchMoveListener = 'MSPointerMove';

    } else {
      tapEventListener('touchstart');
      tapEventListener('touchend');
      tapEventListener('touchcancel');
    }

    tapEventListener('focusin');
    tapEventListener('focusout');

    return function() {
      for (let type in tapEventListeners) {
        tapEventListener(type, false);
      }
      tapDoc = null;
      tapActiveEle = null;
      tapEnabledTouchEvents = false;
      tapPointerMoved = false;
      tapPointerStart = null;
    };
  },

  ignoreScrollStart (e) {
    // defaultPrevented has been assigned by another component handling the event
    return (e.defaultPrevented) ||
      (/^(file|range)$/i).test(e.target.type) ||
      // manually set within an elements attributes
      (e.target.dataset ?
        e.target.dataset.preventScroll :
        e.target.getAttribute('data-prevent-scroll')) === 'true' ||
      // flash/movie/object touches should not try to scroll
      (!!(/^(object|embed)$/i).test(e.target.tagName)) ||
      // check if this element, or an ancestor, has `data-tap-disabled` attribute
      Tap.isElementTapDisabled(e.target);
  },

  isTextInput (ele) {
    return !!ele &&
      (ele.tagName === 'TEXTAREA' ||
      ele.contentEditable === 'true' ||
      (ele.tagName === 'INPUT' &&
      !(/^(radio|checkbox|range|file|submit|reset|color|image|button)$/i).test(ele.type)));
  },

  isDateInput (ele) {
    return !!ele &&
      (ele.tagName === 'INPUT' &&
      (/^(date|time|datetime-local|month|week)$/i).test(ele.type));
  },

  isKeyboardElement (ele) {
    if (!Platform.isIOS() || Platform.isIPad()) {
      return Tap.isTextInput(ele) && !Tap.isDateInput(ele);
    } else {
      return Tap.isTextInput(ele) || (!!ele && ele.tagName === "SELECT");
    }
  },

  isLabelWithTextInput (ele) {
    let container = tapContainingElement(ele, false);
    return !!container && Tap.isTextInput(tapTargetElement(container));
  },

  containsOrIsTextInput (ele) {
    return Tap.isTextInput(ele) || Tap.isLabelWithTextInput(ele);
  },

  cloneFocusedInput (container) {
    if (Tap.hasCheckedClone) {
      return;
    }

    Tap.hasCheckedClone = true;

    DomUtil.requestAnimationFrame(() => {
      let focusInput = container.querySelector(':focus');

      if (Tap.isTextInput(focusInput) && !Tap.isDateInput(focusInput)) {
        let clonedInput = focusInput.cloneNode(true);

        clonedInput.value = focusInput.value;
        clonedInput.classList.add('cloned-text-input');
        clonedInput.readOnly = true;

        if (focusInput.isContentEditable) {
          clonedInput.contentEditable = focusInput.contentEditable;
          clonedInput.innerHTML = focusInput.innerHTML;
        }
        focusInput.parentElement.insertBefore(clonedInput, focusInput);
        focusInput.classList.add('previous-input-focus');

        clonedInput.scrollTop = focusInput.scrollTop;
      }
    });
  },

  hasCheckedClone: false,

  removeClonedInputs (container) {
    Tap.hasCheckedClone = false;

    DomUtil.requestAnimationFrame(() => {
      let clonedInputs = container.querySelectorAll('.cloned-text-input');
      let previousInputFocus = container.querySelectorAll('.previous-input-focus');
      let x;

      for (x = 0; x < clonedInputs.length; x++) {
        clonedInputs[x].parentElement.removeChild(clonedInputs[x]);
      }

      for (x = 0; x < previousInputFocus.length; x++) {
        previousInputFocus[x].classList.remove('previous-input-focus');
        previousInputFocus[x].style.top = '';

        if (Keyboard.isOpen && !Keyboard.isClosing) {
          previousInputFocus[x].focus();
        }
      }
    });
  },

  requiresNativeClick (ele) {
    if (!ele ||
      ele.disabled ||
      (/^(file|range)$/i).test(ele.type) ||
      (/^(object|video)$/i).test(ele.tagName) ||
      Tap.isLabelContainingFileInput(ele)) {
      return true;
    }
    return Tap.isElementTapDisabled(ele);
  },

  isLabelContainingFileInput (ele) {
    let lbl = tapContainingElement(ele);

    if (lbl.tagName !== 'LABEL') {
      return false;
    }

    let fileInput = lbl.querySelector('input[type=file]');

    if (fileInput && fileInput.disabled === false) {
      return true;
    }
    return false;
  },

  isElementTapDisabled (ele) {
    if (ele && ele.nodeType === 1) {
      let element = ele;

      while (element) {
        if ((element.dataset ?
          element.dataset.tapDisabled :
          element.getAttribute('data-tap-disabled')) === 'true') {
          return true;
        }
        element = element.parentElement;
      }
    }
    return false;
  },

  setTolerance (releaseTolerance, releaseButtonTolerance) {
    TAP_RELEASE_TOLERANCE = releaseTolerance;
    TAP_RELEASE_BUTTON_TOLERANCE = releaseButtonTolerance;
  },

  cancelClick () {
    // used to cancel any simulated clicks which may happen on a touchend/mouseup
    // gestures uses this method within its tap and hold events
    tapPointerMoved = true;
  },

  pointerCoord (event) {
    // This method can get coordinates for both a mouse click
    // or a touch depending on the given event
    let c = {
      x: 0,
      y: 0
    };

    if (event) {
      let touches = event.touches && event.touches.length ? event.touches : [event];
      let e = (event.changedTouches && event.changedTouches[0]) || touches[0];

      if (e) {
        c.x = e.clientX || e.pageX || 0;
        c.y = e.clientY || e.pageY || 0;
      }
    }
    return c;
  }
};

function tapEventListener(type, enable, useCapture) {
  if (enable !== false) {
    tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
  } else {
    tapDoc.removeEventListener(type, tapEventListeners[type]);
  }
}

function tapClick(e) {
  // simulate a normal click by running the element's click method then focus on it
  let container = tapContainingElement(e.target);
  let ele = tapTargetElement(container);

  if (Tap.requiresNativeClick(ele) || tapPointerMoved) {
    return false;
  }

  let c = Tap.pointerCoord(e);

  //console.log('tapClick', e.type, ele.tagName, '('+c.x+','+c.y+')');
  triggerMouseEvent('click', ele, c.x, c.y);

  // if it's an input, focus in on the target, otherwise blur
  tapHandleFocus(ele);
}

function triggerMouseEvent(type, ele, x, y) {
  // using initMouseEvent instead of MouseEvent for our Android friends
  let clickEvent = document.createEvent("MouseEvents");

  clickEvent.initMouseEvent(
    type, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);

  clickEvent.isIonicTap = true;
  ele.dispatchEvent(clickEvent);
}

function tapClickGateKeeper(e) {
  //console.log('click ' + Date.now() + ' isIonicTap: ' + (e.isIonicTap ? true : false));
  if (e.target.type === 'submit' && e.detail === 0) {
    // do not prevent click if it came from an "Enter" or "Go" keypress submit
    return null;
  }

  // do not allow through any click events that were not created by Tap
  if ((Scroll.isScrolling && Tap.containsOrIsTextInput(e.target)) ||
      (!e.isIonicTap && !Tap.requiresNativeClick(e.target))) {
    //console.log('clickPrevent', e.target.tagName);
    e.stopPropagation();

    if (!Tap.isLabelWithTextInput(e.target)) {
      // labels clicks from native should not preventDefault
      // othersize keyboard will not show on input focus
      e.preventDefault();
    }
    return false;
  }
}

// MOUSE
function tapMouseDown(e) {
  //console.log('mousedown ' + Date.now());
  if (e.isIonicTap || tapIgnoreEvent(e)) {
    return null;
  }

  if (tapEnabledTouchEvents) {
    console.log('mousedown', 'stop event');
    e.stopPropagation();

    if ((!Tap.isTextInput(e.target) ||
      tapLastTouchTarget !== e.target) &&
      !(/^(select|option)$/i).test(e.target.tagName)) {
      // If you preventDefault on a text input then you cannot move its text caret/cursor.
      // Allow through only the text input default. However, without preventDefault on an
      // input the 300ms delay can change focus on inputs after the keyboard shows up.
      // The focusin event handles the chance of focus changing after the keyboard shows.
      e.preventDefault();
    }

    return false;
  }

  tapPointerMoved = false;
  tapPointerStart = Tap.pointerCoord(e);

  tapEventListener('mousemove');
  Activator.start(e);
}

function tapMouseUp(e) {
  //console.log("mouseup " + Date.now());
  if (tapEnabledTouchEvents) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  if (tapIgnoreEvent(e) || (/^(select|option)$/i).test(e.target.tagName)) {
    return false;
  }

  if (!tapHasPointerMoved(e)) {
    tapClick(e);
  }
  tapEventListener('mousemove', false);
  Activator.end();
  tapPointerMoved = false;
}

function tapMouseMove(e) {
  if (tapHasPointerMoved(e)) {
    tapEventListener('mousemove', false);
    Activator.end();
    tapPointerMoved = true;
    return false;
  }
}


// TOUCH
function tapTouchStart(e) {
  //console.log("touchstart " + Date.now());
  if (tapIgnoreEvent(e)) {
    return;
  }

  tapPointerMoved = false;

  tapEnableTouchEvents();
  tapPointerStart = Tap.pointerCoord(e);

  tapEventListener(tapTouchMoveListener);
  Activator.start(e);

  if (Platform.isIOS() && Tap.isLabelWithTextInput(e.target)) {
    // if the tapped element is a label, which has a child input
    // then preventDefault so iOS doesn't ugly auto scroll to the input
    // but do not prevent default on Android or else you cannot move the text caret
    // and do not prevent default on Android or else no virtual keyboard shows up

    let textInput = tapTargetElement(tapContainingElement(e.target));
    if (textInput !== tapActiveEle) {
      // don't preventDefault on an already focused input or else iOS's text caret isn't usable
      e.preventDefault();
    }
  }
}

function tapTouchEnd(e) {
  //console.log('touchend ' + Date.now());
  if (tapIgnoreEvent(e)) {
    return;
  }

  tapEnableTouchEvents();

  if (!tapHasPointerMoved(e)) {
    tapClick(e);

    if ((/^(select|option)$/i).test(e.target.tagName)) {
      e.preventDefault();
    }
  }

  tapLastTouchTarget = e.target;
  tapTouchCancel();
}

function tapTouchMove(e) {
  if (tapHasPointerMoved(e)) {
    tapPointerMoved = true;
    tapEventListener(tapTouchMoveListener, false);
    Activator.end();
    return false;
  }
}

function tapTouchCancel() {
  tapEventListener(tapTouchMoveListener, false);
  Activator.end();
  tapPointerMoved = false;
}

function tapEnableTouchEvents() {
  tapEnabledTouchEvents = true;
  clearTimeout(tapMouseResetTimer);
  tapMouseResetTimer = setTimeout(() => {
    tapEnabledTouchEvents = false;
  }, 600);
}

function tapIgnoreEvent(e) {
  if (e.isTapHandled) {
    return true;
  }
  e.isTapHandled = true;

  if (Scroll.isScrolling && Tap.containsOrIsTextInput(e.target)) {
    e.preventDefault();
    return true;
  }
}

function tapHandleFocus(ele) {
  tapTouchFocusedInput = null;

  let triggerFocusIn = false;

  if (ele.tagName === 'SELECT') {
    // trick to force Android options to show up
    triggerMouseEvent('mousedown', ele, 0, 0);
    if (ele.focus) {
      ele.focus();
    }

    triggerFocusIn = true;
  } else if (tapActiveElement() === ele) {
    // already is the active element and has focus
    triggerFocusIn = true;
  } else if ((/^(input|textarea)$/i).test(ele.tagName) || ele.isContentEditable) {
    triggerFocusIn = true;
    if (ele.focus) {
      ele.focus();
    }

    ele.value = ele.value;

    if (tapEnabledTouchEvents) {
      tapTouchFocusedInput = ele;
    }
  } else {
    tapFocusOutActive();
  }

  if (triggerFocusIn) {
    tapActiveElement(ele);
    Events.trigger('focusin', {
      target: ele
    }, true);
  }
}

function tapFocusOutActive() {
  let ele = tapActiveElement();
  if (ele &&
    ((/^(input|textarea|select)$/i).test(ele.tagName) ||
    ele.isContentEditable)) {
    console.log('tapFocusOutActive', ele.tagName);
    ele.blur();
  }
  tapActiveElement(null);
}

function tapFocusIn(e) {
  // console.log('focusin ' + Date.now());
  // Because a text input doesn't preventDefault (so the caret still works) there's a chance
  // that its mousedown event 300ms later will change the focus to another element after
  // the keyboard shows up.

  if (tapEnabledTouchEvents &&
    Tap.isTextInput(tapActiveElement()) &&
    Tap.isTextInput(tapTouchFocusedInput) &&
    tapTouchFocusedInput !== e.target) {

    // 1) The pointer is from touch events
    // 2) There is an active element which is a text input
    // 3) A text input was just set to be focused on by a touch event
    // 4) A new focus has been set, however the target isn't the one the touch event wanted
    console.log('focusin', 'tapTouchFocusedInput');
    tapTouchFocusedInput.focus();
    tapTouchFocusedInput = null;
  }
  Scroll.isScrolling = false;
}

function tapFocusOut() {
  //console.log("focusout");
  tapActiveElement(null);
}

function tapActiveElement(ele) {
  if (arguments.length) {
    tapActiveEle = ele;
  }
  return tapActiveEle || document.activeElement;
}

function tapHasPointerMoved(endEvent) {
  if (!endEvent ||
    endEvent.target.nodeType !== 1 ||
    !tapPointerStart ||
    (tapPointerStart.x === 0 && tapPointerStart.y === 0)) {
    return false;
  }
  let endCoordinates = Tap.pointerCoord(endEvent);

  let hasClassList = !!(endEvent.target.classList &&
    endEvent.target.classList.contains &&
    typeof endEvent.target.classList.contains === 'function');

  let releaseTolerance = hasClassList &&
    endEvent.target.classList.contains('button') ? TAP_RELEASE_BUTTON_TOLERANCE :
    TAP_RELEASE_TOLERANCE;

  return Math.abs(tapPointerStart.x - endCoordinates.x) > releaseTolerance ||
    Math.abs(tapPointerStart.y - endCoordinates.y) > releaseTolerance;
}

function tapContainingElement(ele, allowSelf) {
  let climbEle = ele;
  for (let x = 0; x < 6; x++) {
    if (!climbEle) {
      break;
    }

    if (climbEle.tagName === 'LABEL') {
      return climbEle;
    }

    climbEle = climbEle.parentElement;
  }

  if (allowSelf !== false) {
    return ele;
  }
}

function tapTargetElement(ele) {
  if (ele && ele.tagName === 'LABEL') {
    if (ele.control) {
      return ele.control;
    }

    // older devices do not support the "control" property
    if (ele.querySelector) {
      const control = ele.querySelector('input,textarea,select');
      if (control) {
        return control;
      }
    }
  }
  return ele;
}

export default Tap;
