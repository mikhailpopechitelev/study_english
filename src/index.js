import React, { useRef } from 'react';
import './index.scss';
import { createGlobalStyle } from 'styled-components';
import { accent } from '@salutejs/plasma-tokens';

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import { App } from './Components/App/App';
import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { colorValues } from '@salutejs/plasma-tokens';
import { text, background, gradient } from '@salutejs/plasma-tokens';

var ans = '';
let state = {
  notes: [],
};

const initializeAssistant = (getState) => {
  console.log('создался бот');
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIwYTE3OGI2Ni04NjYxLTRmNmYtOTc5Yi1hZmIxZTM3MTdkMjIiLCJzdWIiOiI5ODIxY2IxNGNiNGZlMzQyMzlhNmM1MDliNTgzNjIwY2E2ZDg5OGU1MDc0YTA4ZTMwMjdmMzk0OTg3YjNjZDkxNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NzI5NDAxNCwiYXVkIjoiVlBTIiwiaWF0IjoxNjg3MjA3NjA0LCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiNzk2MWQzMTAtYWQ0Zi00YTc3LTg5ODktMDgzOTQzMzkwNjA0In0.JRLY1QyvXQbWQIcuET_9fsqJosagHO5fG4BrXOwJzlZihlgIO1CDSSiPy3PpQZcfvSuv4-7h064a7K0KUnDrWr3d1vNiKT8YEkqd5XNYXsgactF4FKHqYhzzMrfpQkzXLHcMn3aufUwvGOP9XLxLG8_o-kVLzjaAE9SujdHiBpbjRDphO6CiJeo8XbwmQVAnQNTndf8fR-H7X-Sl-QrgauldA9Gby3ipkXp37GV0NROMhabFn7l0BG8j21lH5A0QnS8RVFXTkstSme-QMX4MnV_rxYQQASqqYwzl3w5A3IEeVLr_YLdXb-9xF7jmgjohSmYIhXNDYPA8ne7FO1QfcVBsl9cwfWupmowZGxap_TYiCfEe3_QzY1uX1XA07C4QfYdhKnkZA8VWKAeTlOQzIIsay32zEI7x7PTLYN0ljljPQeiIXVXBx0ogg_RKGcWyNjks7M_8YI0_SqG5L4yDBE3Rmlct4LgUgIh38b-0It5Jz9EHJ3BKlDdLy1hBzpoMK_INFDIFZ-f7iKRmuybgFz1ofhUQqbdC517nmRiAwcZJ8zsQJlZTHMwCglZoURj-naBjAgUwOCRnwhul3-AtB8fbj-9UrfNx8ZPOlPoGLxKsCOlk9l_ZauEHWxnNcYIIAiTjTYMWI7X3IBuUndP2M-ZDJqlKPc-DIz5iUQ9VEXs', //process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

function getStateForAssistant() {
  var tmp = {
    item_selector: {
      items: state.notes.map(({ id, title }, index) => ({
        number: index + 1,
        id,
        title,
      })),
    },
  };
  return tmp;
}

const DocStyles = createGlobalStyle`
  html {
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};

    /** необходимо залить градиентом всю подложку */
    min-height: 100vh;
  }
`;

const assistant = initializeAssistant(() => getStateForAssistant());

ReactDOM.render(
  <React.StrictMode>
    <DeviceThemeProvider>
      <App assistant={assistant} state={state} />
    </DeviceThemeProvider>
    <DocStyles />
  </React.StrictMode>,
  document.getElementById('root'),
);
