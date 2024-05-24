const startButton = document.getElementById('startButton');
const questionDiv = document.getElementById('question');
const answerDiv = document.getElementById('answer');

const questions = [
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
    { question: 'How many continents are there?', answer: 'Seven' },
    { question: 'What is the tallest mountain in the world?', answer: 'Mount Everest' },
    { question: 'Who wrote "Romeo and Juliet"?', answer: 'William Shakespeare' },
    { question: 'What is the chemical symbol for water?', answer: 'H2O' },
    { question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci' },
    { question: 'What is the largest ocean on Earth?', answer: 'Pacific Ocean' },
    { question: 'What is the boiling point of water in Celsius?', answer: '100 degrees' },
    { question: 'Who was the first person to step on the moon?', answer: 'Neil Armstrong' }
  ];
  

let currentQuestionIndex = 0;

startButton.addEventListener('click', () => {
  startQuiz();
});

function startQuiz() {
  if (currentQuestionIndex < questions.length) {
    askQuestion();
  } else {
    endQuiz();
  }
}

function askQuestion() {
  const question = questions[currentQuestionIndex];
  questionDiv.textContent = question.question;
  readText(question.question);

  const recognition = new (webkitSpeechRecognition || SpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  let timer;

  recognition.onresult = function(event) {
    clearTimeout(timer);

    const userAnswer = event.results[0][0].transcript.trim();
    answerDiv.textContent = `Your answer: ${userAnswer}`;
    checkAnswer(userAnswer, question.answer);
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
  };

  timer = setTimeout(() => {
    recognition.stop();
    answerDiv.textContent = 'Time is up!';
    currentQuestionIndex++;
    setTimeout(startQuiz, 6000); // Wait 2 seconds before asking the next question
  }, 10000); // 10 seconds timer
}

function readText(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  window.speechSynthesis.speak(speech);
}

function checkAnswer(userAnswer, correctAnswer) {
  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    answerDiv.textContent += ' - Correct!';
  } else {
    answerDiv.textContent += ' - Wrong!';
  }
  currentQuestionIndex++;
  setTimeout(startQuiz, 2000); // Wait 2 seconds before asking the next question
}

function endQuiz() {
  questionDiv.textContent = 'Quiz finished!';
  answerDiv.textContent = '';
}
