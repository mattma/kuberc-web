/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'main-alerts',
  'Integration: MainAlertsComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#main-alerts}}
      //     template content
      //   {{/main-alerts}}
      // `);

      this.render(hbs`{{main-alerts}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
