import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

const {merge, run} = Ember;

export default function startApp(attrs) {
  let application;

  let attributes = merge({}, config.APP);
  // use defaults, but you can override;
  attributes = merge(attributes, attrs);

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
