/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'app-header',
  'Integration: AppHeaderComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#app-header}}
      //     template content
      //   {{/app-header}}
      // `);

      this.render(hbs`{{app-header}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
