import React from 'react';
import './index.scss';
import { createGlobalStyle } from 'styled-components';
import ReactDOM from 'react-dom';
import { App } from './Components/App/App';
import { DeviceThemeProvider } from '@salutejs/plasma-ui';

import { text, background, gradient } from '@salutejs/plasma-tokens';
import { assistant, state } from './api/sberApi';

const DocStyles = createGlobalStyle`
  html {
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};

    /** необходимо залить градиентом всю подложку */
    min-height: 100vh;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <DeviceThemeProvider>
      <App assistant={assistant} state={state} />
    </DeviceThemeProvider>
    <DocStyles />
  </React.StrictMode>,
  document.getElementById('root'),
);
