import { useEffect, useState, React } from 'react';
import { list } from '../../assets/list';
import { AppItem } from '../AppItem';
import { Button } from '@salutejs/plasma-ui';
import { Container } from '@salutejs/plasma-ui/components/Grid';
import { similarity } from '../../assets/functions';
import styles from './app.module.scss';


// limit for ignore words
const trashLimit = 0.7;

export function App(props) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shiffledAnswer, setShiffledAnswer] = useState(null);
  const [answerCount, setAnswerCount] = useState({ current: 0, failed: 0 });
  const [userAnswer, setUserAnswer] = useState([]);
  const [usedSentences, setUsedSentences] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    newQuestion();
    props.assistant.on('data', (event) => {
      const { action } = event;
      if (action) {
        console.log('note ' + action.note);
        dispatchAssistantAction(action);
      }
    });
  }, []);
  
  useEffect( () => {
    localStorage.setItem("userAnswer", userAnswer.join(" "))
  }, [userAnswer])

  function dispatchAssistantAction(action) {
    if (action) {
      switch (action.type) {
        case 'get_str':
          console.log(action.note)

          if (action.note.split(" ")[0] == "хуй")
            alert("Хуй могу добавить только в твое тело")

          // HardCode 
          let inputWords = action.note.split(" ")
          let correctWords = localStorage.getItem("ru").split(" ").filter(x => !localStorage.getItem("userAnswer").split(" ").includes(x) )
          let outWords = []
          console.log(localStorage.getItem("userAnswer"))
          console.log(correctWords)
          for (let word in inputWords) {
            let max = 0
            let correct = ""
            
            for (let ans in correctWords) {
              let tmp = similarity(inputWords[word], correctWords[ans].toLowerCase())
              
              if (tmp > max) {
                max = tmp
                correct = correctWords[ans]
              }
            }

            if (max > trashLimit) {
              correctWords = correctWords.filter( value => value != correct)
              outWords.push(correct)
            }
          }

          let index = 0
          const func = () => {
            if (outWords.length) {
              handleClick(outWords[index])
              ++index
            }
            if (index < outWords.length)
              return setTimeout(func, 400)
          }

          func()
          
          console.log("Захардкожено")
          break;
        case 'continue':
          clearAnswers();
          break;

        case 'clear':
          console.log('Бот мудак');
          setUserAnswer([]);

          break;
        case 'remove':
          let inputWords2 = action.note.split(" ")
          let correctWords2 = localStorage.getItem("userAnswer").split(" ")
          let outWords2 = []

          for (let word2 in inputWords2) {
            let max2 = 0
            let correct2 = ""
            
            for (let ans2 in correctWords2) {
              let tmp2 = similarity(inputWords2[word2], correctWords2[ans2].toLowerCase())
              
              if (tmp2 > max2) {
                max2 = tmp2
                correct2 = correctWords2[ans2]
              }
            }

            if (max2 > trashLimit) {
              correctWords2 = correctWords2.filter( value2 => value2 != correct2)
              outWords2.push(correct2)
            }
          }

          let index2 = 0
          const func2 = () => {
            if (outWords2.length) {
              removeSelected(outWords2[index2])
              ++index2
            }
            if (index2 < outWords2.length)
              return setTimeout(func2, 400)
          }

          func2()
          
          console.log("Захардкожено")
          break;
        default:
          throw new Error();
      }
    }
  }

  ///тут формируется новый вопрос

  const newQuestion = () => {
    const newItemNumber = Math.floor(Math.random() * list.length);
    const newItem = list[newItemNumber];
    localStorage.setItem('ru', newItem.ru);
    localStorage.setItem('en', newItem.en);
    //если всего слов равно количеству правильных ответов
    if (answerCount.current >= 10) {

      setIsCompleted(true);
      return;
      //закончить игру

      if(answerCount.current -answerCount.failed >= 7){
        setIsCompleted(true);
        return;
      }else{

      }
    }
    //проверка было ли использовано предложение
    if (
      usedSentences.find(
        (item) =>
          item.ru.toLowerCase().replaceAll(' ') === newItem.ru.toLowerCase().replaceAll(' '),
      )
    ) {
      //console.log(currentQuestion + " 1")
      return newQuestion();
    } else {
      setUsedSentences([...usedSentences, newItem]);
      setCurrentQuestion(newItem);
    }
  };

  //тут перетасовываются 'части' ответа
  function shuffle() {
    const arr = currentQuestion.ru.split(' ');
    return arr ? arr.sort(() => Math.random() - 0.5) : [];
  }

  function clearAnswers() {
    setUsedSentences(usedSentences.pop());
    newQuestion();
    setUserAnswer([]);
  }

  //тут клик на кнопку
  const handleClick = (item) => {
    setUserAnswer((value) => [...value, item]);
  };

  //тут перетасовка ответа при изменение вопроса
  useEffect(() => {
    //console.log(currentQuestion + " 6")
    if (currentQuestion) {
      setShiffledAnswer(shuffle());
      //setContButton(shiffledAnswer.length)
    }
  }, [currentQuestion]);

  //тут проверка ответа при добавлении нового слова

  useEffect(() => {
    //Если ответ пользователя и правильный ответ совпадают
    if (userAnswer.join(' ') === currentQuestion?.ru) {
      setUsedSentences([...usedSentences, currentQuestion]);
      setAnswerCount({ ...answerCount, current: ++answerCount.current });
      setUserAnswer([]);
      newQuestion();
    } else if (userAnswer.length === currentQuestion?.ru.split(' ')?.length) {
      //Если не осталось слов, нечего больше выбирать.
      setAnswerCount({ ...answerCount, failed: ++answerCount.failed });
      setUserAnswer([]);
    }
  }, [userAnswer]);

  function removeSelected(value) {
    const newArray = localStorage.getItem("userAnswer").split(" ").filter((item) => item !== value);
    setUserAnswer(newArray);
  }

  return (
    <Container className={styles.root}>
      {isCompleted ? (
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
                    <Button view="secondary" key={index} onClick={() => removeSelected(item)}>
                      {item}
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
                      <Button view="secondary" key={index} onClick={() => handleClick(item)}>
                        {item}
                      </Button>
                    );
                  }
                })}
              </div>
            </AppItem>
            <div className={styles.answInfo}>
              <div>
                <p>
                  правильно: <b>{answerCount.current}</b>
                </p>
                <p>
                  неправильно: <b>{answerCount.failed}</b>
                </p>
              </div>

              <Button
                onClick={() => {
                  //это пропуск
                  clearAnswers();
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
