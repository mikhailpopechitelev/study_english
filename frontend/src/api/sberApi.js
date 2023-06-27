import { createAssistant, createSmartappDebugger } from '@salutejs/client';

let ans = '';
let state = {
  notes: [],
};

const initializeAssistant = (getState) => {
  console.log('создался бот');
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
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

const assistant = initializeAssistant(() => getStateForAssistant());

export { assistant, state };
