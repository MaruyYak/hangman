const answQstn = [
  {
    question: 'An instrument with strings played with a bow, often used in classical music.', 
    answer: 'VIOLIN'
  },
  {
    question: 'A famous scientist who formulated the theory of relativity.',
    answer:'EINSTEIN'
  },
  {
    question: 'The capital city of France.',
    answer: 'PARIS'
  },
  {
    question: 'A famous detective created by Sir Arthur Conan Doyle.',
    answer: 'SHERLOCK'
  },
  {
    question: 'The largest planet in our solar system.',
    answer: 'JUPITER'
  },
  {
    question: 'A classic board game with properties and houses.',
    answer: 'MONOPOLY'
  },
  {
    question: 'An ancient Egyptian structure with a pointed top.',
    answer: 'PYRAMID'
  },
  {
    question: 'A famous wizard from the Harry Potter series.',
    answer: 'DUMBLEDORE'
  },
  {
    question: 'A legendary creature with a single horn on its forehead.',
    answer: 'UNICORN'
  },
  {
    question: 'The process by which plants make their own food using sunlight.',
    answer: 'PHOTOSYNTHESIS'
  },
  {
    question: 'The largest desert in the world, covering parts of Africa and Asia.',
    answer: 'SAHARA'
  },
  {
    question: 'A fictional wizarding school in the Harry Potter series.',
    answer: 'HOGWARTS'
  }
]
const alphabet = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
'z', 'x', 'c', 'v', 'b', 'n', 'm'];

let mainContainer; // общая область игры
let quizContainer; // область с квизом справа
let gallowContainer; // область виселицы
let keyboardContainer; // клавиатура
let letterDiv;
let answerArea; //область со словом И вопросом
let currentWord; //текущее рандомное слово
let currentQuestionNumber; // номер рандомного масива со словом и вопросом
let hint;
let guesses;  //плашка,которая отображает попытки
let correctWord = [];
let failAttemptCount = 0; // счетчик неправльных попыток ввода
const maxAttemptCount = 6;
let dudeContainer; // html парент элементов человечка 
let parts; // массив частей тела
let modalOverlay; 
let modaltAnswer;
let modalOpened = false;


window.onload = function () {
  generateContent();
}


function generateContent() {    
  mainContainer = document.createElement("main");
  mainContainer.className = "game";
  document.body.appendChild(mainContainer);
  
  generateGallows();
  generateDude();
  
  quizContainer = document.createElement("div");
  quizContainer.className = "quizContainer"
  mainContainer.appendChild(quizContainer);

  answerArea = document.createElement("ul");
  answerArea.className = "answerArea";
  quizContainer.appendChild(answerArea);

  currentQuestionNumber = Math.floor(Math.random() * answQstn.length);

  hint = document.createElement("h3");
  quizContainer.appendChild(hint);

  attempts();
  generateKeyboard();
  addListeners();
  generateAnswerField();
  generateModalWindow();
}

// создание гельятины
function generateGallows() {
  gallowContainer = document.createElement("div");
  gallowContainer.className = "gallowContainer";
  mainContainer.appendChild(gallowContainer);

  for (let i = 1; i <= 5; i++) {
    const gallowDiv = document.createElement("div");
    gallowDiv.className = "gallow" + i;
    gallowContainer.appendChild(gallowDiv);
  }
}

// создание виртуальной клавиатуры
function generateKeyboard() {
  keyboardContainer = document.createElement("div");
  keyboardContainer.className = "keyboardContainer";
  quizContainer.appendChild(keyboardContainer);
  
  alphabet.forEach(element => {
    letterDiv = document.createElement("div");
    letterDiv.className = "letter";
    letterDiv.innerHTML = element.toUpperCase();
    keyboardContainer.appendChild(letterDiv);
  });
  }

// добавление кликера на клавиатуру виртуальную и физическую
function addListeners() {
  document.addEventListener("keydown", (event) => {
    if(modalOpened) {
      return
    };
    const isLetter = /^[a-zA-ZА-Яа-я]$/.test(event.key);
    if (!isLetter) {
      return;
    }
    const findKey = [...keyboardContainer.children].find((element) => element.innerText.toUpperCase() === event.key.toUpperCase());
    if (!findKey) {
      alert("Swithch to english!");
    }
    // console.log(findKey);
    if(!findKey.classList.contains("letterPressed")) {
      findKey.classList.add("letterPressed");
      guessesingProcces(findKey.innerText.toUpperCase());
    }
  });

  keyboardContainer.addEventListener("click", (event) => {
    if(modalOpened) {
      return
    };
    if(event.target.classList.contains('letter') && !event.target.classList.contains("letterPressed")) {
      // console.log(`Key clicked: ${event.target.innerText.toUpperCase()}`);
      event.target.classList.add("letterPressed");
      guessesingProcces(event.target.innerText.toUpperCase())
    };
  })
}

// генерация слова и вопроса
function generateAnswerField() {
  // console.log(currentWord)
  currentWord = answQstn[currentQuestionNumber];
  answerArea.innerHTML = "";

  currentWord.answer.split('').forEach(() => {
    const currentLetter = document.createElement("li");
    currentLetter.className = "currentLetter";
    answerArea.appendChild(currentLetter);
  })

  // console.log(currentWord.answer)
  hint.className = "hint";
  hint.textContent = "Hint: " + currentWord.question;
}

// проверка наличия нажатой буквы
function guessesingProcces(pressedKey) {
  const answerLettersArray = currentWord.answer.split('');

  if(answerLettersArray.includes(pressedKey)) {
    answerLettersArray.forEach((letter, index) => {
        if(letter === pressedKey) {
          correctWord.push(letter);
          answerArea.children[index].innerText = letter;
          answerArea.children[index].classList.add("guessedLetter");
        }
      });
  } else {
    failAttemptCount ++;
    updateAttempts();
  }
  checkEndGame();
}

// создание поля попыток
function attempts() {
  guesses = document.createElement("h3");
  guesses.className = "attempts";
  quizContainer.appendChild(guesses);
  updateAttempts()
}

// обновление попыток
function updateAttempts() {
  guesses.innerHTML = `Incorrect guesses: ${failAttemptCount} / ${maxAttemptCount}`; 
  if(failAttemptCount === 0) {
    return
  }
  dudeContainer.querySelector(`.${parts[failAttemptCount - 1]}`).classList.add('partVisible');
}

// создание человечка
function generateDude() {
  dudeContainer = document.createElement("div");
  dudeContainer.className = "dude";
  gallowContainer.appendChild(dudeContainer);

  parts = ['head', 'body', 'armL', 'armR', 'legR', 'legL'];
  
  parts.forEach(part => {
    const partElement = document.createElement("div");
    partElement.className = part;
    dudeContainer.appendChild(partElement);
  })
}
// вощвращает результат игры
function getQuizResult() {
  if (failAttemptCount === maxAttemptCount) {
    document.querySelector('.starOver').style.backgroundColor = '#88090963';
    return "Game Over!";
  }
  if (correctWord.length === currentWord.answer.length) {
    document.querySelector('.starOver').style.backgroundColor = '#0d47077a';
    return "That's right!";
  }
}
// создание и отображение модального окна
function generateModalWindow() {
  modalOverlay = document.createElement("div");
  modalOverlay.className = "modalOverlay";
  mainContainer.appendChild(modalOverlay); 

  const modalWindow = document.createElement("div");
  modalWindow.className = "modalWindow";
  modalOverlay.appendChild(modalWindow);

  quizResult = document.createElement("h3");
  quizResult.className = "quizResult";
  modalWindow.appendChild(quizResult);

  modaltAnswer = document.createElement("p");
  modaltAnswer.className = "rightAnswer";
  modalWindow.appendChild(modaltAnswer);

  const starOverButton = document.createElement("button");
  starOverButton.className = "starOver";
  modalWindow.appendChild(starOverButton);
  starOverButton.innerText = "Play again";

  starOverButton.addEventListener('click', reloadWindow);
}

function checkEndGame() {
  // console.log(correctWord)
  if(failAttemptCount === maxAttemptCount || correctWord.length === currentWord.answer.length) {
    document.querySelector('.quizResult').innerText = getQuizResult();
    modalOverlay.classList.add('showModal');
    modalOpened = true;
    modaltAnswer.innerHTML = `It was a word: <span class="styleBold">${currentWord.answer}</span>`;
  }
}

function reloadWindow() {
  failAttemptCount = 0;
  correctWord = [];
  modalOverlay.classList.remove('showModal');

  [...dudeContainer.children].forEach((bodyPart) => {
    bodyPart.classList.remove('partVisible');
  });

  [...keyboardContainer.children].forEach((key) => {
    key.classList.remove('letterPressed');
  })

  if (currentQuestionNumber < answQstn.length - 1) {
    currentQuestionNumber ++; 
  } else {
    currentQuestionNumber = 0;
  }
  updateAttempts()
  generateAnswerField();
  modalOpened = false;
}