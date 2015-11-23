/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'app-dashboard',
  'Integration: AppDashboardComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#app-dashboard}}
      //     template content
      //   {{/app-dashboard}}
      // `);

      this.render(hbs`{{app-dashboard}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
