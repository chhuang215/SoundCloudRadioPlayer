import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from './App.jsx';

import * as SC from 'soundcloud';

Meteor.startup(() => {
  SC.initialize({
      client_id: '70ecd4982ab636cda94484106b9dae0f',
  });

  render(<App />, document.getElementById('render-target'));
});
