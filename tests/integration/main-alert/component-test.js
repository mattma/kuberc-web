/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'main-alert',
  'Integration: MainAlertComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#main-alert}}
      //     template content
      //   {{/main-alert}}
      // `);

      this.render(hbs`{{main-alert}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
