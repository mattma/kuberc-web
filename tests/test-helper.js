// import { use } from 'chai';
// import sinonChai from 'sinon-chai';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

setResolver(resolver);

// use(sinonChai);
/* jshint ignore:start */
mocha.setup({
    timeout: 15000,
    slow: 500
});
/* jshint ignore:end */
