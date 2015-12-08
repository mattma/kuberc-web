/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'route:login',
  'LoginRoute',
  // 'service:notifications',
  {
    unit: true
  },
  function() {
    // it('exists', function() {
    //   console.log('route: ', this.subject());
    //   var route = this.subject();
    //   expect(route).to.be.ok;
    // });
  }
);
