import Ember from 'ember';
// start-non-standard
import computed from 'ember-computed-decorators';
// end-non-standard
const {Component} = Ember;

// ES7 Decorator: https://github.com/rwjblue/ember-computed-decorators
// https://github.com/martndemus/ember-cli-font-awesome/blob/master/addon/components/fa-icon.js
function match (object, regex) {
  return (typeof object) === 'string' && object.match(regex);
}

const FaIconComponent = Component.extend({
  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: [
    'iconCssClass',
    'sizeCssClass'
  ],

  // start-non-standard
  @computed('icon', 'params.[]')
  // end-non-standard
  iconCssClass(icon, params) {
    icon = icon || params[0];
    if (icon) {
      return match(icon, /^fa-/) ? icon : `fa-${icon}`;
    }
  },

  // start-non-standard
  @computed('size')
  // end-non-standard
  sizeCssClass(size) {
    if (match(size, /^fa-/)) {
      return size;
    } else if (match(size, /(?:lg|x)$/)) {
      return `fa-${size}`;
    } else {
      return `fa-${size}x`;
    }
  }
});

FaIconComponent.reopenClass({
  positionalParams: 'params'
});

export default FaIconComponent;
