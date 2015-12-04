import Ember from 'ember';
const {Mixin, run, $} = Ember;

// mixin used for routes that need to set a css className on the body tag
export default Mixin.create({
  activate() {
    this._super(...arguments);

    let cssClasses = this.get('classNames');
    if (cssClasses) {
      run.schedule('afterRender', null, () => {
        cssClasses.forEach(curClass => $('body').addClass(curClass));
      });
    }
  },

  deactivate() {
    this._super(...arguments);

    let cssClasses = this.get('classNames');
    if (cssClasses) {
      run.schedule('afterRender', null, () => {
        cssClasses.forEach(curClass => $('body').removeClass(curClass));
      });
    }
  }
});
