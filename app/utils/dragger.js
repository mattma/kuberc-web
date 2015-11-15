import Ember from 'ember';

// Finder constructor, used to handle set/remove interval
function Dragger(el, context) {
  this.el = Ember.$(el);
  this.element = el;
  this.ctx = context;

  this.mc = new Hammer.Manager(el);
  this.START_X = 0;
  this.START_Y = Math.round((Ember.$('body').height() - 300) / 2);
  this.ticking = false;

  // always make sure the card is showing
  this.el.css('display', 'block');

  this._setup();
}

Dragger.prototype._setup = function () {
  this.mc.add(new Hammer.Pan({
    threshold: 0,
    pointers: 0
  }));

  this.mc.on("panstart panmove", onPan.bind(this));

  this._resetElement();
};

export default Dragger;

function onPan(ev) {
  // this.el.addClass('');
  this.transform.translate = {
    x: this.START_X + ev.deltaX,
    y: this.START_Y + ev.deltaY
  };

  // logEvent(ev);
  this._requestElementUpdate();
}

// function logEvent(ev) {
//   console.log('ev.type: ', ev.type);
//   //el.innerText = ev.type;
// }

Dragger.prototype._resetElement = function() {
  this.el.addClass('animate');
  this.transform = {
    translate: {
      x: this.START_X,
      y: this.START_Y
    },
    scale: 1,
    angle: 0,
    rx: 0,
    ry: 0,
    rz: 0
  };

  this._requestElementUpdate();
};

Dragger.prototype._requestElementUpdate = function () {
  if (!this.ticking) {
    this._reqAnimationFrame()(updateElementTransform.bind(this));
    this.ticking = true;
  }
};

/**
 * kind of messy code, but good enough for now
 */
// polyfill
Dragger.prototype._reqAnimationFrame = function() {
  return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
};

function updateElementTransform() {
  var value = [
    'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
    'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
    'rotate3d(' + this.transform.rx + ',' + this.transform.ry + ',' +
      this.transform.rz + ',' + this.transform.angle + 'deg)'
  ];

  value = value.join(" ");

  this.element.style.webkitTransform = value;
  this.element.style.mozTransform = value;
  this.element.style.transform = value;

  this.ticking = false;

  if (this.transform.translate.y < 0) {
    this.mc.off("panstart panmove", onPan);
    this.el.fadeOut(300, () => {
      // send the action to "dashboard.nearby" actions handleSendCard
      Ember.run(() => this.ctx.send('handleSendCard'));
    });
  }
}
