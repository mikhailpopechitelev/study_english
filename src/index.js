import React, { useRef } from 'react';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  createAssistant,
  createSmartappDebugger,
} from "@salutejs/client"


var ans = ""
let state = {
  notes: [],
}


const initializeAssistant = (getState) => {
  console.log('создался бот')
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIzYWU1NTk4ZS1mZTI2LTRkZTgtYmM5ZC1iODE2NmIzM2U5NGIiLCJzdWIiOiI5ODIxY2IxNGNiNGZlMzQyMzlhNmM1MDliNTgzNjIwY2E2ZDg5OGU1MDc0YTA4ZTMwMjdmMzk0OTg3YjNjZDkxNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NzIwNzU2OCwiYXVkIjoiVlBTIiwiaWF0IjoxNjg3MTIxMTU4LCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiNWM3ZTVkNTQtYTA3Ni00YjA5LWI5YzQtN2RmOTI5ZDIyZmFmIn0.sf1T0YXUdQLySimB51wlc_JdAnT5iX-6TgZrz6EEZKp6UPqLkcuA0F57lxzjhg-qPvbmqaltJkEeJCzksSTOCfXX_w83eyA1EAVnJeIMkEsPFZSfbnup_Nxb_eyyQ24QugljW01oB0hiuJbrZXVVfXUNPOBRHbfN1s9U8JTsKa-l9tUrNm1fZs0qqJ8dHT-QB9OzKb9xd9eoCwMqpNqYvUEX-hi6PtOBxySiI0DIIZ5QA-Qi4MboVcaCrpqSgD56Dtci89U2btucTUoDTFa2wE9I22nH7mXE9l5FRcOzhYu-AQWtKTrGJpBp9r8ltgObFkpxYr_XqLxHSO9VeD0vfjOAygqxesgj1-F_-AvDL6YkSHDQ-lASWBg-WBce6m96PQlxJPQUylWPDpxBGLEBQ3KrRQOQPj4lqcuCVsn9UD5y0MOdxGW4cRwPjdzAOownW5pNiHHeIsavnrnpsQ_3U96jnIqYPvhPhiMFPi9TaI7Wq6g2rvq_G8WWCNIgjPsMfoQ1ez5Hdl2auFycmhxyl_oNyIYoFlQ7whiJluDFIB7yHOhg866e2SLne18G-m4zbzqYsFYWltlHWBIDCUFdr-NxbpJ83E0XVWgu6BqniTJywTFNTgdrPVz77cSKFU5il3qbISvaQV98t3sIKOB1r6_iCZ1daIf1KOYfsgYA-Lo',//process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};


function getStateForAssistant () {
  var tmp = {
    item_selector: {
      items: state.notes.map(
        ({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })
      ),
    },
  };
  return tmp;
}

//let assistant = initializeAssistant(() => getStateForAssistant());
const assistant = initializeAssistant(() => getStateForAssistant())

ReactDOM.render(
  <React.StrictMode>
    <App assistant = {assistant}  state = {state}/>
  </React.StrictMode>,
  document.getElementById('root')
)
