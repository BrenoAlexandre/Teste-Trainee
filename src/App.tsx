import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToggleMenuProvider } from './contexts/ToggleMenuContext';
import Routes from './routes';

const App: React.FunctionComponent = () => (
  <Router>
    <ToggleMenuProvider>
      <Routes />
    </ToggleMenuProvider>
  </Router>
);

export default App;
