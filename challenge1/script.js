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
    question: 'What is the name of the desert planet where Anakin Skywalker was discovered?',
    options: ['Tatooine', 'Hoth', 'Endor', 'Jakku'],
    answer: 'Tatooine' 
  },
  { 
    question: 'What species is Yoda?',
    options: ['Jedi Master', 'Human', 'Wookiee', 'Unknown'],
    answer: 'Unknown' 
  },
  { 
    question: 'Who is the only character to appear in every main Star Wars film?',
    options: ['R2-D2', 'C-3PO', 'Chewbacca', 'Han Solo'],
    answer: 'R2-D2' 
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
    question: 'What is the name of the bounty hunter who froze Han Solo in carbonite?',
    options: ['Boba Fett', 'Dengar', 'Bossk', 'IG-88'],
    answer: 'Boba Fett' 
  },
  { 
    question: 'What is the name of the Sith Lord in "The Phantom Menace"?',
    options: ['Darth Maul', 'Darth Sidious', 'Darth Plagueis', 'Darth Tyranus'],
    answer: 'Darth Maul' 
  },
  { 
    question: 'What is the planet destroying superweapon in "A New Hope"?',
    options: ['Death Star', 'Starkiller Base', 'Executor', 'Star Destroyer'],
    answer: 'Death Star' 
  },
  { 
    question: 'Who trained Obi-Wan Kenobi as a Jedi?',
    options: ['Qui-Gon Jinn', 'Yoda', 'Mace Windu', 'Anakin Skywalker'],
    answer: 'Qui-Gon Jinn' 
  },
  // Add more questions with multiple-choice options here
];

let currentQuestionIndex = 0;
let score = 0;
let recognition; // Variable for speech recognition

startButton.addEventListener('click', () => {
  startQuiz();
});

function startQuiz() {
  score = 0; // Reset the score
  scoreDisplay.textContent = ''; // Clear the score display
  currentQuestionIndex = 0; // Reset question index
  recognition = new (webkitSpeechRecognition || SpeechRecognition)(); // Initialize speech recognition
  recognition.lang = 'en-US'; // Set language to English
  
  askQuestion(); // Start asking questions
}

function askQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    // Show the question
    questionDiv.textContent = question.question;

    readText(question.question, () => {
      // Show the options after reading the question
      const optionsHTML = question.options.map((option, index) => {
        return `<p>${option}</p>`;
      }).join('');
  
      answerDiv.innerHTML = optionsHTML;
  
      recognition.start(); // Start recognition
    });

    recognition.onresult = function(event) {
      const userAnswer = event.results[0][0].transcript.trim().toLowerCase();
      handleAnswer(userAnswer, question.answer);
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };

    setTimeout(() => {
      recognition.stop(); // Stop recognition after 10 seconds
      currentQuestionIndex++;
      askQuestion(); // Move to the next question
    }, 10000); // 10 seconds timer
  } else {
    endQuiz(); // No more questions, end the quiz
  }
}

function readText(text, callback) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  window.speechSynthesis.speak(speech);
  // Call the callback function after reading is completed
  speech.onend = callback;
}

function handleAnswer(userAnswer, correctAnswer) {
  recognition.stop(); // Stop recognition when the user selects an answer
  if (userAnswer === correctAnswer.toLowerCase()) {
    answerDiv.textContent = 'Correct!';
    score += 100; // Increment score for correct answer
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
  } else {
    answerDiv.textContent = 'Wrong!';
    answerDiv.innerHTML += ` The correct answer is: <strong>${correctAnswer}</strong>`;
  }
}

function endQuiz() {
  questionDiv.textContent = 'Quiz finished!';
  answerDiv.textContent = `Your final score is: ${score}`;
}
