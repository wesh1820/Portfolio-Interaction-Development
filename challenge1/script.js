const startButton = document.getElementById('startButton');
const questionDiv = document.getElementById('question');
const answerDiv = document.getElementById('answer');
const scoreDisplay = document.getElementById('score');

const questions = [
  { 
    question: 'Who is the father of Luke Skywalker?',
    options: ['Darth Vader', 'Obi-Wan Kenobi', 'Emperor Palpatine', 'Han Solo'],
    answer: 'Darth Vader' 
  },
  { 
    question: 'Who leads the Rebel Alliance in the original Star Wars trilogy?',
    options: ['Princess Leia', 'Luke Skywalker', 'Han Solo', 'Mon Mothma'],
    answer: 'Princess Leia' 
  },
  { 
    question: 'What species is Yoda?',
    options: ['Jedi Master', 'Human', 'Wookiee', 'Unknown'],
    answer: 'Unknown' 
  },
  { 
    question: 'What is the name of the Wookiee co-pilot of the Millennium Falcon?',
    options: ['Chewbacca', 'Wicket', 'Lando Calrissian', 'Greedo'],
    answer: 'Chewbacca' 
  },
  { 
    question: 'What weapon is associated with the Jedi?',
    options: ['Blaster', 'Lightsaber', 'Bowcaster', 'E-11 Blaster Rifle'],
    answer: 'Lightsaber' 
  },
  { 
    question: 'Who is the pilot of the Millennium Falcon?',
    options: ['Han Solo', 'Luke Skywalker', 'Lando Calrissian', 'Chewbacca'],
    answer: 'Han Solo' 
  },
  { 
    question: 'Who is the bounty hunter who froze Han Solo in carbonite?',
    options: ['Boba Fett', 'Dengar', 'Bossk', 'IG-88'],
    answer: 'Boba Fett' 
  },
  { 
    question: 'Which bounty hunter is also a skilled assassin and appeared in "Attack of the Clones"?',
    options: ['Zam Wesell', 'Aurra Sing', 'Cad Bane', 'Embo'],
    answer: 'Zam Wesell' 
  },
  { 
    question: 'What is the planet-destroying superweapon in "A New Hope"?',
    options: ['Death Star', 'Starkiller Base', 'Executor', 'Star Destroyer'],
    answer: 'Death Star' 
  },
  { 
    question: 'Who trained Obi-Wan Kenobi as a Jedi?',
    options: ['Qui-Gon Jinn', 'Yoda', 'Mace Windu', 'Anakin Skywalker'],
    answer: 'Qui-Gon Jinn' 
  }
];

let currentQuestionIndex = 0;
let score = 0;
let recognition;

startButton.addEventListener('click', () => {
  startQuiz();
});

function startQuiz() {
  score = 0; 
  scoreDisplay.textContent = '';
  currentQuestionIndex = 0;
  recognition = new (webkitSpeechRecognition || SpeechRecognition)();
  recognition.lang = 'en-US';

  askQuestion();
}

function askQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    
    questionDiv.textContent = question.question;

    readText(question.question, () => {
     
      const optionsHTML = question.options.map((option, index) => {
        return `<p>${option}</p>`;
      }).join('');
  
      answerDiv.innerHTML = optionsHTML;
  
      recognition.start(); 
    });

    recognition.onresult = function(event) {
      const userAnswer = event.results[0][0].transcript.trim().toLowerCase();
      handleAnswer(userAnswer, question.answer);
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };

    setTimeout(() => {
      recognition.stop();
      currentQuestionIndex++;
      askQuestion(); 
    }, 10000);
  } else {
    endQuiz(); 
  }
}

function readText(text, callback) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US'; 

  const voices = window.speechSynthesis.getVoices();
 
  const selectedVoice = voices.find(voice => voice.name === 'Google UK English Male');

  if (selectedVoice) {
    speech.voice = selectedVoice;
  } else {
    console.warn('The desired voice is not available.');
  }

  window.speechSynthesis.speak(speech);
  speech.onend = callback; 
}


window.speechSynthesis.onvoiceschanged = () => {
  console.log(window.speechSynthesis.getVoices());
};

function handleAnswer(userAnswer, correctAnswer) {
  recognition.stop(); 
  if (userAnswer === correctAnswer.toLowerCase()) {
    answerDiv.textContent = 'Correct!';
    score += 100; 
    scoreDisplay.textContent = `Score: ${score}`; 
  } else {
    answerDiv.textContent = 'Wrong!';
    answerDiv.innerHTML += ` The correct answer is: <strong>${correctAnswer}</strong>`;
  }
}

function endQuiz() {
  questionDiv.textContent = 'Quiz finished!';
  answerDiv.textContent = `Your final score is: ${score}`;
}
