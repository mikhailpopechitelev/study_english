import { useEffect, useState, useReducer } from 'react';
import { list } from '../../assets/list';
import { AppItem } from '../AppItem';
import { Button } from '@salutejs/plasma-ui';
import { Container } from '@salutejs/plasma-ui/components/Grid';
import { similarity } from '../../assets/functions';
import styles from './app.module.scss';
import 'devextreme/dist/css/dx.light.css';
import Notify from 'devextreme/ui/notify';

// limit for ignore words
const trashLimit = 0.7;

export function App(props) {
  const [qustionsList, setQustionsList] = useState(list.sort(() => 0.5 - Math.random()));
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shiffledAnswer, setShiffledAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answer, dispatchAnsw] = useReducer(answareReducer, { current: 0, failed: 0 });

  function answareReducer(state, action) {
    switch (action.type) {
      case 'CORRECT':
        return {
          current: state.current + 1,
          failed: state.failed,
        };
      case 'FAILED':
        return {
          current: state.current,
          failed: state.failed + 1,
        };
      default:
        break;
    }
  }

  useEffect(() => {
    newQuestion(qustionsList);
    props.assistant.on('data', (event) => {
      const { action } = event;
      if (action) {
        console.log('note ' + action.note);
        dispatchAssistantAction(action);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('userAnswer', userAnswer.join(' '));
  }, [userAnswer]);

  //тут перетасовка ответа при изменение вопроса
  useEffect(() => {
    if (currentQuestion) {
      setShiffledAnswer(shuffle());
    }
  }, [currentQuestion]);

  //тут проверка ответа при добавлении нового слова

  useEffect(() => {
    //Если ответ пользователя и правильный ответ совпадают
    if (userAnswer.length === currentQuestion?.ru.split(' ').length) {
      if (userAnswer.join(' ').toLowerCase() === currentQuestion?.ru.toLowerCase()) {
        console.log('first');
        dispatchAnsw({ type: 'CORRECT' });
        props.assistant?.sendData({"action": {"action_id":"DONE_NOTE", "parameters": true}})
      } else {
        dispatchAnsw({ type: 'FAILED' });
        props.assistant?.sendData({"action": {"action_id":"DONE_NOTE", "parameters": false}})
      }
      newQuestion();
    }
  }, [userAnswer]);

  function dispatchAssistantAction(action) {
    console.log('привет');
    if (action) {
      switch (action.type) {
        case 'get_str':
          console.log(action.note);
          // HardCode
          let inputWords = action.note.split(' ');
          let correctWords = localStorage
            .getItem('ru')
            .split(' ')
            .filter((x) => !localStorage.getItem('userAnswer').split(' ').includes(x));
          let outWords = [];
          console.log(localStorage.getItem('userAnswer'));
          console.log(correctWords);
          for (let word in inputWords) {
            let max = 0;
            let correct = '';
            for (let ans in correctWords) {
              let tmp = similarity(inputWords[word], correctWords[ans].toLowerCase());

              if (tmp > max) {
                max = tmp;
                correct = correctWords[ans];
              }
            }

            if (max > trashLimit) {
              correctWords = correctWords.filter((value) => value !== correct);
              outWords.push(correct);
            }
          }

          let index = 0;
          const func = () => {
            if (outWords.length) {
              onSelectWord(outWords[index]);
              ++index;
            }
            if (index < outWords.length) return setTimeout(func, 400);
          };

          func();

          console.log('Захардкожено');
          break;
        case 'continue':
          skipAnswers();
          break;

        case 'clear':
          console.log('Бот мудак');
          setUserAnswer([]);

          break;
        case 'remove':
          let inputWords2 = action.note.split(' ');
          let correctWords2 = localStorage.getItem('userAnswer').split(' ');
          let outWords2 = [];

          for (let word2 in inputWords2) {
            let max2 = 0;
            let correct2 = '';

            for (let ans2 in correctWords2) {
              let tmp2 = similarity(inputWords2[word2], correctWords2[ans2].toLowerCase());

              if (tmp2 > max2) {
                max2 = tmp2;
                correct2 = correctWords2[ans2];
              }
            }

            if (max2 > trashLimit) {
              correctWords2 = correctWords2.filter((value2) => value2 != correct2);
              outWords2.push(correct2);
            }
          }

          let index2 = 0;
          const func2 = () => {
            if (outWords2.length) {
              removeSelected(outWords2[index2]);
              ++index2;
            }
            if (index2 < outWords2.length) return setTimeout(func2, 400);
          };

          func2();

          console.log('Захардкожено');
          break;
        default:
          throw new Error();
      }
    }
  }

  ///тут формируется новый вопрос

  function newQuestion({ isSkiping } = { isSkiping: false }) {
    // Очищаем список выбранных
    setUserAnswer([]);
    setShiffledAnswer([]);
    console.log('qstList.length', qustionsList.length);
    if (qustionsList.length === 0) {
      console.log('СПИСОК ПУСТОЙ!');
      setIsCompleted(true);
      setCurrentQuestion(null);
      return;
    }
    let newItem = null;
    if (isSkiping) {
      setQustionsList([currentQuestion, ...qustionsList.slice(0, -1)]);
      newItem = qustionsList.at(-1);
    } else {
      newItem = qustionsList.at(-1);
      setQustionsList([...qustionsList.slice(0, -1)]);
    }
    setCurrentQuestion(newItem);

    localStorage.setItem('ru', newItem.ru);
    localStorage.setItem('en', newItem.en);

    //если всего слов равно количеству правильных ответов
    if (isCompleted) {
      const isSuccess = answer.current - answer.failed >= 6;
      const status = isSuccess ? 'success' : 'error';
      const message = isSuccess
        ? 'Поздравляю ваш уровень английского не меньше A2! Это важный этап в вашем языковом развитии. Вы смогли освоить базовую лексику и грамматику, что позволяет вам вести простые разговоры на английском. Продолжайте практиковаться и стремиться к новым целям! Удачи в дальнейшем изучении языка!'
        : 'Хочу выразить вам соболезнования в связи с тем, что ваш текущий уровень английского языка пока не достигает уровня A2. Не беспокойтесь, это нормальная часть процесса обучения, и вы находитесь на пути к успеху. Продолжайте упорно работать над своими навыками, изучать новые слова и грамматику, а также общаться на английском языке. ';
      Notify(
        {
          message,
        },
        status,
        5000,
      );
    }
  }

  //тут перетасовываются 'части' ответа
  function shuffle() {
    const arr = currentQuestion.ru.split(' ').map((item, index) => {
      return { value: item, id: index };
    });

    return arr ? arr.sort(() => Math.random() - 0.5) : [];
  }

  function skipAnswers() {
    console.log(qustionsList);
    newQuestion({ isSkiping: true });
  }

  //тут клик на кнопку
  const onSelectWord = (item) => {
    setUserAnswer((value) => [...value, item]);
  };

  function removeSelected(id) {
    const newArray = userAnswer.filter((item) => {
      return item.id !== id;
    });
    setUserAnswer(newArray);
  }

  return (
    <Container className={styles.root}>
      {isCompleted && false ? (
        <div className="end">congratulations!</div>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.cardWrap}>
            <AppItem title={'Learn English'}>
              <p>
                Переведи: <span className={styles.underline}>{currentQuestion?.en}</span>
              </p>
            </AppItem>
            <AppItem title={'Ваш ответ:'}>
              <div className={styles.selectedWords}>
                {userAnswer?.map((item, index) => {
                  return (
                    <Button view="secondary" key={index} onClick={() => removeSelected(item.id)}>
                      {item.value}
                    </Button>
                  );
                })}
              </div>
            </AppItem>
            <AppItem title={'Выбери правильный порядок слов:'}>
              <div className={styles.selectedWords}>
                {shiffledAnswer?.map((item, index) => {
                  if (!userAnswer.includes(item)) {
                    return (
                      <Button view="secondary" key={index} onClick={() => onSelectWord(item)}>
                        {item.value}
                      </Button>
                    );
                  }
                })}
              </div>
            </AppItem>
            <div className={styles.answInfo}>
              <div>
                <p>
                  правильно: <b>{answer.current}</b>
                </p>
                <p>
                  неправильно: <b>{answer.failed}</b>
                </p>
              </div>

              <Button
                disabled={qustionsList.length === 0}
                onClick={() => {
                  skipAnswers();
                }}>
                Пропустить
              </Button>
            </div>
          </div>

          <div className="btn_skip"></div>
        </div>
      )}
    </Container>
  );
}

export default App;
