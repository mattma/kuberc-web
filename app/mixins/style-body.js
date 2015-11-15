// mixin used for routes that need to set a css className on the body tag
// `routes/*.js`, common error: applied on `controller`, it won't work
// @usage
/*
 import styleBody from 'dashboard/mixins/style-body';

 var LoginRoute = Ember.Route.extend(styleBody, {
  classNames: ['ts-login']
 });

 export default LoginRoute;
 */
import Ember from 'ember';

var StyleBodyMixin = Ember.Mixin.create({
  activate: function () {
    this._super();

    var cssClasses = this.get('classNames');

    if (cssClasses) {
      Ember.run.schedule('afterRender', null, function () {
        cssClasses.forEach(function (curClass) {
          Ember.$('body').addClass(curClass);
        });
      });
    }
  },

  deactivate: function () {
    this._super();

    var cssClasses = this.get('classNames');

    Ember.run.schedule('afterRender', null, function () {
      cssClasses.forEach(function (curClass) {
        Ember.$('body').removeClass(curClass);
      });
    });
  }
});

export default StyleBodyMixin;
