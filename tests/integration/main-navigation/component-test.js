/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'main-navigation',
  'Integration: MainNavigationComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#main-navigation}}
      //     template content
      //   {{/main-navigation}}
      // `);

      this.render(hbs`{{main-navigation}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
