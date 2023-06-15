import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { list } from "./assets/list";
import {
  createAssistant,
  createSmartappDebugger,
} from "@salutejs/client"

const initializeAssistant = (getState) => {
  let i
  console.log("создался бот "+i)
  i+=1;
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxMDRiZDQzOS0wNmU4LTQ3YjItOGIzZC1iYzg2ZmMyNzczMTQiLCJzdWIiOiI5ODIxY2IxNGNiNGZlMzQyMzlhNmM1MDliNTgzNjIwY2E2ZDg5OGU1MDc0YTA4ZTMwMjdmMzk0OTg3YjNjZDkxNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NjkyNjU2MiwiYXVkIjoiVlBTIiwiaWF0IjoxNjg2ODQwMTUyLCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiYWZjYTc1NmItMTIwOS00NDNiLThiODUtNzFjMWNkYTM1YTYzIn0.CROAYWGxGYZlGIR59eftaP-obRyhwdgarIhXVyxFMFpsoiU_E89koeomFgV-syldD8xbO5vIcMVZACewgN6jhQxq61NXKvXxpiPdGq2j84qn3xb-445SxYOAjxVfS7NxJwmShuVFfBq29sRErExArMSob1qwLciws2zP0M__Fbmys6nat1_jhljCGfcpmMFlbi0hryiZIN1cLVnx4UuxgUYZgwJtFj74VD4X_r5nQlu4lTt5IQ8pKLmaKL8XTOkaTNpCVXBUngwXvRFQZjzMeDwFBVbSvqwmNt04_3cIoM1wIOsTDPHvndDZ2uvSBB-Jph9RBPECcqgYrKOpEo99OcDW3ejccngSlJDUbYHlGZ7rHKLFIzlbjvi6RWLqDYD9gsf8sAjiYHnoyL7Mmmt7pzZNzi_G1N5MSo5S5eSXAR9kx49iseZgtXdGDvNRVArVQQ8UUerCNagTk1WVNBQmyn1mkOOkLpzm_YH8bGxeU49KQFbXGBHFl52lBIvbDjUJvWsJvDa0aCAcgZ24syQO2auyyZdSHlmJdiVml-fiTbKLZ_S9VFpAhNzTj5DVhgzbF2MgB-VKaIixE7QLM-k22sNcfwACqgQKIvNUsfNds5Ff0K6i53dQyUMStW9S-xFv_Ceg46dC8KHOoOhFzU-5TendQ9n7EjJNSq6LrIdbjiQ"/*process.env.REACT_APP_TOKEN ?? ""*/,
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

function App() {

  var ans = ""
  let state = {
    notes: [],
  }


  useEffect(() => {
    let assistant = initializeAssistant(() => getStateForAssistant() );
    assistant.on("data", (event) => {
      console.log(event)
      const { action } = event
      dispatchAssistantAction(action);
    });
  },[])

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
    //console.log('getStateForAssistant: state:', state)
    return tmp;
  }

  function dispatchAssistantAction(action){
    if (action) {
      switch (action.type) {
        case 'get_str':

          add_plitka(action)
          break

        default:
          throw new Error();  
      }
    }
  }

  


  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shiffledAnswer, setShiffledAnswer] = useState(null);
  const [answerCount, setAnswerCount] = useState({ current: 0, failed: 0 });
  const [userAnswer, setUserAnswer] = useState([]);
  const [usedSentences, setUsedSentences] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);



  //тут формируется новый вопрос


  const newQuestion = () => {
    const newItemNumber = Math.floor(Math.random() * list.length);
    const newItem = list[newItemNumber];
    //если всего слов равно количеству правильных ответов
    if (list.length === answerCount.current) {
      //закончить игру
      setIsCompleted(true);
      return;
    }

    
    //проверка было ли использовано предложение
    if (
      usedSentences.find(
        (item) =>
          item.ru.toLowerCase().replaceAll(" ") ===
          newItem.ru.toLowerCase().replaceAll(" ")
      )
    ) 
    {
      return newQuestion();
    } else {
      setUsedSentences([...usedSentences, newItem]);
      setCurrentQuestion(newItem);
    }
  };


  //тут перетасовываются 'части' ответа
  function shuffle() {
    const arr = currentQuestion.ru.split(" ");
    return arr ? arr.sort(() => Math.random() - 0.5) : [];
  }


  //тут клик на кнопку
  const handleClick = (item) => {
    setUserAnswer([...userAnswer, item]);
  };


  //тут установка вопроса при первой загрузке
  useEffect(() => {
    newQuestion();
  }, []);


  //тут перетасовка ответа при изменение вопроса
  useEffect(() => {
    if (currentQuestion) {
      setShiffledAnswer(shuffle());
    }
  }, [currentQuestion]);

  console.log(shiffledAnswer)
  if(shiffledAnswer != null){
    var buttonList = shiffledAnswer
  }

  const add_plitka = (action) => {
    console.log(buttonList)
    if(buttonList.map(e => e.toLowerCase()).includes(action.note)){
      setUserAnswer([...userAnswer, action.note]);
    }
  }

  //тут проверка ответа при добавлении нового слова
  useEffect(() => {
    //Если ответ пользователя и правильный ответ совпадают
    if (userAnswer.join(" ") === currentQuestion?.ru) {
      setUsedSentences([...usedSentences, currentQuestion]);
      setAnswerCount({ ...answerCount, current: ++answerCount.current });
      setUserAnswer([]);
      newQuestion();
    } else if (userAnswer.length === currentQuestion?.ru.split(" ")?.length) {
      //Если не осталось слов, нечего больше выбирать.
      setAnswerCount({ ...answerCount, failed: ++answerCount.failed });
      setUserAnswer([]);
    }
  }, [userAnswer]);

  console.log(shiffledAnswer)
  return (
    <div className="container">
      {isCompleted ? (
        <div className="end">congratulations!</div>
      ) : (
        <div className="wrapper">
          <div className="header" id = "hui">Learn English</div>
          <div className="question">Переведи: {currentQuestion?.en}</div>
          <div className="user_answer">
            <div className="user_answer_header">Ваш ответ:</div>
            <div className="user_answer_current">
              <span>{userAnswer?.join(" ")}</span>
            </div>
          </div>
          <div className="btn">
            <div className="btn_header">Выбери правильный порядок слов</div>
            <div className="btn_list">
              {shiffledAnswer?.map((item, index) => {
                if (!userAnswer.includes(item)) {
                  //это кнопки с ответами
                  return (
                    <button key={index} onClick={() => handleClick(item)}>
                      {item}
                    </button>
                  );
                }
              })}
            </div>
          </div>
          <div className="answer_count">
            <span>
              правильно: <b>{answerCount.current}</b>
            </span>
            <span>
              неправильно: <b>{answerCount.failed}</b>
            </span>
          </div>
          <div className="btn_skip">
            <button
              onClick={() => {
                //это пропуск
                setUsedSentences(usedSentences.pop());
                newQuestion();
              }}
            >
              Пропустить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
