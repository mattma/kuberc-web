import Ember from 'ember';
const {Component} = Ember;

export default Component.extend({
  tagName: 'nav',
  classNames: ['secondary-navigation'],
  classNameBindings: ['showSidebar::hide']
});
