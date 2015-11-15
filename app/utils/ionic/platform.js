import DomUtil from 'ts/utils/ionic/dom';

const IOS = 'ios';
const ANDROID = 'android';
const WINDOWS_PHONE = 'windowsphone';
let platformName = null; // just the name, like iOS or Android
let platformVersion = null; // a float of the major and minor, like 7.1

/**
 * @name Platform
 * @description
 * A set of utility methods that can be used to retrieve the device ready state and
 * various other information such as what kind of platform the app is currently installed on.
 *
 * @usage
 * ```js
 *   Platform.ready(function(){
 *     // will execute when device is ready, or immediately if the device is already ready.
 *   });
 *
 *   var deviceInformation = Platform.device();
 *
 *   var isWebView = Platform.isWebView();
 *   var isIPad = Platform.isIPad();
 *   var isIOS = Platform.isIOS();
 *   var isAndroid = Platform.isAndroid();
 *   var isWindowsPhone = Platform.isWindowsPhone();
 *
 *   var currentPlatform = Platform.platform();
 *   var currentPlatformVersion = Platform.version();
 *
 *   Platform.exitApp(); // stops the app
 * ```
 */
let Platform = {
  // Put navigator on platform so it can be mocked and set
  // the browser does not allow window.navigator to be set
  navigator: window.navigator,
  /**
   * @ngdoc property
   * @name Platform#isReady
   * @returns {boolean} Whether the device is ready.
   */
  isReady: false,
  /**
   * @ngdoc property
   * @name Platform#isFullScreen
   * @returns {boolean} Whether the device is fullscreen.
   */
  isFullScreen: false,
  /**
   * @ngdoc property
   * @name Platform#platforms
   * @returns {Array(string)} An array of all platforms found.
   */
  platforms: null,
  /**
   * @ngdoc property
   * @name Platform#grade
   * @returns {string} What grade the current platform is.
   */
  grade: null,
  ua: navigator.userAgent,

  /**
   * Since we moved `readyCallbacks` to `init.js`, we have to attach it to the
   * Platform itself to support this feature
   */
  readyCallbacks: [],

  /**
   * @ngdoc method
   * @name Platform#ready
   * @description
   * Trigger a callback once the device is ready, or immediately
   * if the device is already ready. This method can be run from
   * anywhere and does not need to be wrapped by any additonal methods.
   * When the app is within a WebView (Cordova), it'll fire
   * the callback once the device is ready. If the app is within
   * a web browser, it'll fire the callback after `window.load`.
   * Please remember that Cordova features (Camera, FileSystem, etc) still
   * will not work in a web browser.
   * @param {function} callback The function to call.
   */
  ready (cb) {
    // run through tasks to complete now that the device is ready
    if (Platform.isReady) {
      cb();
    } else {
      // the platform isn't ready yet, add it to this array
      // which will be called once the platform is ready
      Platform.readyCallbacks.push(cb);
    }
  },

  /**
   * @private
   * body tag will add platform related classes
   * ex: platform-browser, platform-macintel
   */
  detect () {
    // heavy lifting, called several internal api to figure out the current device or browsers
    Platform._checkPlatforms();

    DomUtil.requestAnimationFrame(() => {
      // only add to the body class if we got platform info
      for (var i = 0; i < Platform.platforms.length; i++) {
        document.body.classList.add('platform-' + Platform.platforms[i]);
      }
    });
  },

  /**
   * @ngdoc method
   * @name Platform#setGrade
   * body tag will add grade class. ex: grade-a, grade-b, grade-c
   * @description Set the grade of the device: 'a', 'b', or 'c'. 'a' is the best
   * (most css features enabled), 'c' is the worst.  By default, sets the grade
   * depending on the current device.
   * @param {string} grade The new grade to set.
   */
  setGrade (grade) {
    let oldGrade = Platform.grade;
    Platform.grade = grade;
    DomUtil.requestAnimationFrame(() => {
      if (oldGrade) {
        document.body.classList.remove('grade-' + oldGrade);
      }
      document.body.classList.add('grade-' + grade);
    });
  },

  /**
   * @ngdoc method
   * @name Platform#device
   * @description Return the current device (given by cordova).
   * @returns {object} The device object.
   */
  device () {
    return window.device || {};
  },

  _checkPlatforms () {
    Platform.platforms = [];
    let grade = 'a';

    if (Platform.isWebView()) {
      Platform.platforms.push('webview');

      if (!(!window.cordova && !window.PhoneGap && !window.phonegap)) {
        Platform.platforms.push('cordova');
      } else if (window.forge) {
        Platform.platforms.push('trigger');
      }
    } else {
      Platform.platforms.push('browser');
    }

    if (Platform.isIPad()) {
      Platform.platforms.push('ipad');
    }

    // ex: ios, andriod, etc
    const platform = Platform.platform();
    if (platform) {
      Platform.platforms.push(platform);

      const version = Platform.version();
      if (version) {
        let v = version.toString();
        if (v.indexOf('.') > 0) {
          v = v.replace('.', '_');
        } else {
          v += '_0';
        }
        Platform.platforms.push(platform + v.split('_')[0]);
        Platform.platforms.push(platform + v);

        if (Platform.isAndroid() && version < 4.4) {
          grade = (version < 4 ? 'c' : 'b');
        } else if (Platform.isWindowsPhone()) {
          grade = 'b';
        }
      }
    }

    Platform.setGrade(grade);
  },

  /**
   * @ngdoc method
   * @name Platform#isWebView
   * @returns {boolean} Check if we are running within a WebView (such as Cordova).
   */
  isWebView () {
    return !(!window.cordova && !window.PhoneGap && !window.phonegap && !window.forge);
  },
  /**
   * @ngdoc method
   * @name Platform#isIPad
   * @returns {boolean} Whether we are running on iPad.
   */
  isIPad () {
    if (/iPad/i.test(Platform.navigator.platform)) {
      return true;
    }
    return /iPad/i.test(Platform.ua);
  },
  /**
   * @ngdoc method
   * @name ionic.Platform#isIOS
   * @returns {boolean} Whether we are running on iOS.
   */
  isIOS () {
    return Platform.is(IOS);
  },
  /**
   * @ngdoc method
   * @name Platform#isAndroid
   * @returns {boolean} Whether we are running on Android.
   */
  isAndroid () {
    return Platform.is(ANDROID);
  },
  /**
   * @ngdoc method
   * @name Platform#isWindowsPhone
   * @returns {boolean} Whether we are running on Windows Phone.
   */
  isWindowsPhone () {
    return Platform.is(WINDOWS_PHONE);
  },

  /**
   * @ngdoc method
   * @name Platform#platform
   * @returns {string} The name of the current platform.
   */
  platform () {
    // singleton to get the platform name
    if (platformName === null) {
      Platform.setPlatform(Platform.device().platform);
    }
    return platformName;
  },

  /**
   * @private
   */
  setPlatform (n) {
    if (typeof n !== 'undefined' && n !== null && n.length) {
      platformName = n.toLowerCase();
    } else if (Platform.ua.indexOf('Android') > 0) {
      platformName = ANDROID;
    } else if (/iPhone|iPad|iPod/.test(Platform.ua)) {
      platformName = IOS;
    } else if (Platform.ua.indexOf('Windows Phone') > -1) {
      platformName = WINDOWS_PHONE;
    } else {
      platformName = Platform.navigator.platform &&
        navigator.platform.toLowerCase().split(' ')[0] || '';
    }
  },

  /**
   * @ngdoc method
   * @name Platform#version
   * @returns {number} The version of the current device platform. ex: 8 for ios 8
   */
  version () {
    // singleton to get the platform version
    if (platformVersion === null) {
      Platform.setVersion(Platform.device().version);
    }
    return platformVersion;
  },

  /**
   * @private
   */
  setVersion (v) {
    if (typeof v !== 'undefined' && v !== null) {
      v = v.split('.');
      v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
      if (!isNaN(v)) {
        platformVersion = v;
        return;
      }
    }

    platformVersion = 0;

    // fallback to user-agent checking
    const pName = Platform.platform();
    const versionMatch = {
      'android': /Android (\d+).(\d+)?/,
      'ios': /OS (\d+)_(\d+)?/,
      'windowsphone': /Windows Phone (\d+).(\d+)?/
    };
    if (versionMatch[pName]) {
      v = Platform.ua.match(versionMatch[pName]);
      if (v && v.length > 2) {
        platformVersion = parseFloat(v[1] + '.' + v[2]);
      }
    }
  },

  // Check if the platform is the one detected by cordova
  is (type) {
    type = type.toLowerCase();
    // check if it has an array of platforms
    if (Platform.platforms) {
      for (var x = 0; x < Platform.platforms.length; x++) {
        if (Platform.platforms[x] === type) {
          return true;
        }
      }
    }
    // exact match
    const pName = Platform.platform();
    if (pName) {
      return pName === type.toLowerCase();
    }

    // A quick hack for to check userAgent
    return Platform.ua.toLowerCase().indexOf(type) >= 0;
  },

  /**
   * @ngdoc method
   * @name Platform#exitApp
   * @description Exit the app.
   */
  exitApp () {
    Platform.ready(() => {
      if(navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
      }
    });
  },

  /**
   * @ngdoc method
   * @name Platform#showStatusBar
   * @description Shows or hides the device status bar (in Cordova).
   * Requires `cordova plugin add org.apache.cordova.statusbar`
   * @param {boolean} shouldShow Whether or not to show the status bar.
   */
  showStatusBar (val) {
    // Only useful when run within cordova
    Platform._showStatusBar = val;
    Platform.ready(() => {
      // run this only when or if the platform (cordova) is ready
      DomUtil.requestAnimationFrame(() => {
        if (Platform._showStatusBar) {
          // they do not want it to be full screen
          if(window.StatusBar) {
            window.StatusBar.show();
          }
          document.body.classList.remove('status-bar-hide');
        } else {
          // it should be full screen
          if(window.StatusBar) {
            window.StatusBar.hide();
          }
          document.body.classList.add('status-bar-hide');
        }
      });
    });
  },

  /**
   * @ngdoc method
   * @name Platform#fullScreen
   * @description
   * Sets whether the app is fullscreen or not (in Cordova).
   * @param {boolean=} showFullScreen
   *  Whether or not to set the app to fullscreen. Defaults to true.
   * Requires `cordova plugin add org.apache.cordova.statusbar`
   * @param {boolean=} showStatusBar
   *  Whether or not to show the device's status bar. Defaults to false.
   */
  fullScreen (showFullScreen, showStatusBar) {
    // showFullScreen: default is true if no param provided
    Platform.isFullScreen = (showFullScreen !== false);

    // add/remove the fullscreen classname to the body
    DomUtil.ready(() => {
      // run this only when or if the DOM is ready
      DomUtil.requestAnimationFrame(() => {
        if (Platform.isFullScreen) {
          document.body.classList.add('fullscreen');
        } else {
          document.body.classList.remove('fullscreen');
        }
      });
      // showStatusBar: default is false if no param provided
      Platform.showStatusBar((showStatusBar === true));
    });
  }
};

export default Platform;
