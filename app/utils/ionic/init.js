import Platform from 'ts/utils/ionic/platform';
import DomUtil from 'ts/utils/ionic/dom';
import Events from 'ts/utils/ionic/events';
import Tap from 'ts/utils/ionic/tap';
import {
  keyboardInitViewportHeight,
  keyboardOrientationChange,
  keyboardInit
} from 'ts/utils/ionic/keyboard';

/**
 * Abstract from `platform.js`
 * will setup the class on the Document Body tag
 */
let windowLoadListenderAttached;

function onPlatformReady() {
  // the device is all set to go, init our own stuff then fire off our event
  Platform.isReady = true;
  Platform.detect();
  for (var x = 0; x < Platform.readyCallbacks.length; x++) {
    // fire off all the callbacks that were added before the platform was ready
    Platform.readyCallbacks[x]();
  }
  Platform.readyCallbacks = [];
  Events.trigger('platformready', { target: document });

  DomUtil.requestAnimationFrame(() => {
    document.body.classList.add('platform-ready');
  });
}

// setup listeners to know when the device is ready to go
function onWindowLoad() {
  if (Platform.isWebView()) {
    // the window and scripts are fully loaded, and a cordova/phonegap
    // object exists then let's listen for the deviceready
    document.addEventListener("deviceready", onPlatformReady, false);
  } else {
    // the window and scripts are fully loaded, but the window object doesn't have the
    // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
    onPlatformReady();
  }

  if (windowLoadListenderAttached) {
    window.removeEventListener("load", onWindowLoad, false);
  }
}

/**
 * Abstract from `dom.js`
 * will setup the class on the Document Body tag
 */
function domReady() {
  DomUtil.isDomReady = true;
  for (var x = 0; x < DomUtil.readyCallbacks.length; x++) {
    DomUtil.requestAnimationFrame(DomUtil.readyCallbacks[x]);
  }
  DomUtil.readyCallbacks = [];
  document.removeEventListener('DOMContentLoaded', domReady);
}

let MobileInit = {
  initialize () {
    MobileInit.setBodyClass();
    MobileInit.onDomReady();
    MobileInit.setupKeyboardEvents();
    MobileInit.registerTap();
  },

  /**
   * abstracted from `platform.js`
   * set up the className on Body tag
   * ex: grade-a platform-browser platform-ios platform-ios8 platform-ios8_0 platform-ready
   */
  setBodyClass () {
    if (document.readyState === 'complete') {
      onWindowLoad();
    } else {
      windowLoadListenderAttached = true;
      window.addEventListener("load", onWindowLoad, false);
    }
  },
  /**
   * Add domReady event, so client could access it trigger `domReady` callback
   * @return null
   */
  onDomReady () {
    if (!DomUtil.isDomReady) {
      document.addEventListener('DOMContentLoaded', domReady);
    }
  },

  setupKeyboardEvents () {
    Platform.ready(() => {
      keyboardInitViewportHeight();

      window.addEventListener('orientationchange', keyboardOrientationChange);

      // if orientation changes while app is in background, update on resuming
      if (Platform.isWebView()) {
        document.addEventListener('resume', keyboardInitViewportHeight);

        if (Platform.isAndroid()) {
          //TODO: onbackpressed to detect keyboard close without focusout or plugin
        }
      }

      // if orientation changes while app is in background, update on resuming
      if (Platform.isWebView()) {
        document.addEventListener('pause', () => {
          window.removeEventListener('orientationchange', keyboardOrientationChange);
        });
        document.addEventListener('resume', () => {
          keyboardInitViewportHeight();
          window.addEventListener('orientationchange', keyboardOrientationChange);
        });
      }

      // Android sometimes reports bad innerHeight on window.load
      // try it again in a lil bit to play it safe
      setTimeout(keyboardInitViewportHeight, 999);

      // only initialize the adjustments for the virtual keyboard
      // if a touchstart event happens
      if (window.navigator.msPointerEnabled) {
        document.addEventListener("MSPointerDown", keyboardInit, false);
      } else {
        document.addEventListener('touchstart', keyboardInit, false);
      }
    });
  },

  registerTap () {
    DomUtil.ready(() => Tap.register(document));
  }
};

export default MobileInit;
