import { useEffect, useLayoutEffect, useRef, useState, React } from "react";
import "./App.css";
import { list } from "./assets/list";

import {
  createAssistant,
  createSmartappDebugger,
} from "@salutejs/client"
import { initializeAssistantSDK } from "@sberdevices/assistant-client";


/*
export class App extends React.Component{
  constructor(props) {
    
    super(props);
    console.log('constructor');

    
    this.state = {
      notes: [],
    }

  
    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

    useEffect(() => {
      newQuestion();
    }, []);
  
    //тут перетасовка ответа при изменение вопроса
    useEffect(() => {
      if (currentQuestion) {
        setShiffledAnswer(shuffle());
      }
    }, [currentQuestion]);
  
      //тут проверка ответа при добавлении нового слова
      useEffect(() => {
        //Если ответ пользователя и правильный ответ совпадают
        if (userAnswer.join(" ") === currentQuestion?.ru) {
          setUsedSentences([...usedSentences, currentQuestion]);
          setAnswerCount({ ...answerCount, current: ++answerCount.current  });
          setUserAnswer([]);
          newQuestion();
        } else if (userAnswer.length === currentQuestion?.ru.split(" ")?.length) {
          //Если не осталось слов, нечего больше выбирать.
          setAnswerCount({ ...answerCount, failed: ++answerCount.failed  });
          setUserAnswer([]);
          //tmpUserAnswer = []
        }
      }, [userAnswer]);


  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.notes.map(
          ({ id, title }, index) => ({
            number: index + 1,
            id,
            title,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }

  dispatchAssistantAction (action){
    if (action) {
      switch (action.type) {
        case 'get_str':
          handleClick(action.note)
          break

        default:
          throw new Error();  
      }
    }
  }

  newQuestion = () => {
    const newItemNumber = Math.floor(Math.random() * list.length);
    const newItem = list[newItemNumber];
    //если всего слов равно количеству правильных ответов
    if (list.length === this.answerCount.current) {
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
    } else 
    {
      setUsedSentences([...usedSentences, newItem]);
      setCurrentQuestion(newItem);
    }
    
  };


  //тут перетасовываются 'части' ответа
  shuffle() {
    const arr = currentQuestion.ru.split(" ");
    return arr ? arr.sort(() => Math.random() - 0.5) : [];
  }


  //тут клик на кнопку
  
  handleClick = (item) => {
    setUserAnswer([...userAnswer, item]);
  };


  render() {
    console.log('render');
    return (
      <div className="container">
        {isCompleted ? (
          <div className="end">congratulations!</div>
        ) : (
          <div className="wrapper">
            <div className="header">Learn English</div>
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
}
*/


function App(props) {

  //let assistant = initializeAssistant(() => getStateForAssistant() );


  /*
  function dispatchAssistantAction(action){
    if (action) {
      switch (action.type) {
        case 'get_str':
          handleClick(action.note)
          break

        default:
          throw new Error();  
      }
    }
  }*/
  

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shiffledAnswer, setShiffledAnswer] = useState(null);
  const [answerCount, setAnswerCount] = useState({ current: 0, failed: 0 });
  const [userAnswer, setUserAnswer] = useState([]);
  const [usedSentences, setUsedSentences] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [contButton, setContButton] = useState(0);
  

  useEffect(() => {
    props.assistant.on("data",(event) => {
      const { action } = event
      if((action)&&((action.note!=userAnswer[userAnswer.length-1])||(userAnswer.length==0))){
        dispatchAssistantAction(action)
      }
    }); 
  },[userAnswer]);

  
  function dispatchAssistantAction(action){
    if (action) {
      switch (action.type) {
        case 'get_str':
          handleClick(action.note)
          break
  
        default:
          throw new Error();  
      }
    }
  }

  /*
  props.assistant.on("data", (event) => {
    const { action } = event
    if(action){
      dispatchAssistantAction(action);
    };
  });*/
  /*
  useEffect(() => {
    props.assistant.on("data", (event) => {
      const { action } = event
      if(action){
        dispatchAssistantAction(action);
      };
    });
  },[])
*/
///тут формируется новый вопрос

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
    } else 
    {
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
    console.log(userAnswer)
  };


  //тут установка вопроса при первой загрузке
  useEffect(() => {
    newQuestion();
  }, []);


  //тут перетасовка ответа при изменение вопроса
  useEffect(() => {
    
    if (currentQuestion) {
      setShiffledAnswer(shuffle());
      //setContButton(shiffledAnswer.length)
    }
  }, [currentQuestion]);

    //тут проверка ответа при добавлении нового слова

    useEffect(() => {
      //Если ответ пользователя и правильный ответ совпадают
      console.log(userAnswer + "  Гей")
      if (userAnswer.join(" ") === currentQuestion?.ru) {

        setUsedSentences([...usedSentences, currentQuestion]);
        setAnswerCount({ ...answerCount, current: ++answerCount.current  });
        setUserAnswer([]);
        newQuestion();
      } else if (userAnswer.length === currentQuestion?.ru.split(" ")?.length) {
        //Если не осталось слов, нечего больше выбирать.
        setAnswerCount({ ...answerCount, failed: ++answerCount.failed  });
        setUserAnswer([]);
        //tmpUserAnswer = []
      }
    }, [userAnswer]);

    
  return (
    <div className="container">
      {isCompleted ? (
        <div className="end">congratulations!</div>
      ) : (
        <div className="wrapper">
          <div className="header">Learn English</div>
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
