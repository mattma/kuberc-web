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

  describe('Root path', () => {
    it('should redirect to login page', () => {
      visit('/');

      return andThen(() => {
        expect(currentPath()).to.eq('login');
        let headerText = find('h1').text();
        expect(headerText).contains('Kuberc');
      });
    });
  });
});
