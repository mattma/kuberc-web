/* jshint expr:true */
import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';

describe('Application', function() {
  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
  });

  describe('main layout', () => {
    it('should have a header', () => {
      visit('/');

      return andThen(() => {
        expect(currentPath()).to.eq('index');
        let headerText = find('h2').text();
        expect(headerText).to.eq('Welcome to Ember');
      });
    });
  });
});
