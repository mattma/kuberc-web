import Ember from 'ember';
import computed from 'ember-computed-decorators';

// ES7 Decorator: https://github.com/rwjblue/ember-computed-decorators
// https://github.com/martndemus/ember-cli-font-awesome/blob/master/addon/components/fa-icon.js
function match (object, regex) {
  return (typeof object) === 'string' && object.match(regex);
}

const FaIconComponent = Ember.Component.extend({
  tagName: 'i',

  classNames: ['fa'],

  classNameBindings: [
    'iconCssClass'
  ],

  @computed('icon', 'params.[]')
  iconCssClass(icon, params) {
    icon = icon || params[0];
    if (icon) {
      return match(icon, /^fa-/) ? icon : `fa-${icon}`;
    }
  },
});

FaIconComponent.reopenClass({
  positionalParams: 'params'
});

export default FaIconComponent;
