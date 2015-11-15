import Tap from 'ts/utils/ionic/tap';
import DomUtil from 'ts/utils/ionic/dom';
import Scroll from 'ts/utils/ionic/scroll';

let queueElements = {};   // elements that should get an active state in XX milliseconds
let activeElements = {};  // elements that are currently active
let keyId = 0;            // a counter for unique keys for the above ojects
const ACTIVATED_CLASS = 'activated';

function clear() {
  // clear out any elements that are queued to be set to active
  queueElements = {};

  // in the next frame, remove the active class from all active elements
  DomUtil.requestAnimationFrame(deactivateElements);
}

function activateElements() {
  // activate all elements in the queue
  for (var key in queueElements) {
    if (queueElements[key]) {
      queueElements[key].classList.add(ACTIVATED_CLASS);
      activeElements[key] = queueElements[key];
    }
  }
  queueElements = {};
}

function deactivateElements() {
  // if (ionic.transition && ionic.transition.isActive) {
  //   setTimeout(deactivateElements, 400);
  //   return;
  // }

  for (var key in activeElements) {
    if (activeElements[key]) {
      activeElements[key].classList.remove(ACTIVATED_CLASS);
      delete activeElements[key];
    }
  }
}

let Activator = {
  start (e) {
    let hitX = Tap.pointerCoord(e).x;
    if (hitX > 0 && hitX < 30) {
      return;
    }

    // when an element is touched/clicked, it climbs up a few
    // parents to see if it is an .item or .button element
    DomUtil.requestAnimationFrame(() => {
      if ((Scroll && Scroll.isScrolling) || Tap.requiresNativeClick(e.target)) {
        return;
      }

      let ele = e.target;
      let eleToActivate;

      for (let x = 0; x < 6; x++) {
        if (!ele || ele.nodeType !== 1) {
          break;
        }

        if (eleToActivate && ele.classList && ele.classList.contains('item')) {
          eleToActivate = ele;
          break;
        }

        if (ele.tagName === 'A' || ele.tagName === 'BUTTON') {
          eleToActivate = ele;
          break;
        }

        if (ele.classList.contains('button')) {
          eleToActivate = ele;
          break;
        }

        // no sense climbing past these
        if (ele.tagName === 'ION-CONTENT' ||
          (ele.classList && ele.classList.contains('pane')) ||
          ele.tagName === 'BODY') {
          break;
        }

        ele = ele.parentElement;
      }

      if (eleToActivate) {
        // queue that this element should be set to active
        queueElements[keyId] = eleToActivate;

        // on the next frame, set the queued elements to active
        DomUtil.requestAnimationFrame(activateElements);

        keyId = (keyId > 29 ? 0 : keyId + 1);
      }
    });
  },

  end () {
    // clear out any active/queued elements after XX milliseconds
    setTimeout(clear, 200);
  }
};

export default Activator;
