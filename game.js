(function() {
    // Recuperar parámetros del menú desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const difficultyParam = urlParams.get('difficulty') || 'normal'; // "easy", "normal", "hard"
    const botsCount = parseInt(urlParams.get('botsCount')) || 1; // Número de bots
  
    // Mapear dificultad a tiempo (en segundos)
    const timeLimits = {
      'easy': 10,
      'normal': 5,
      'hard': 3
    };
    const timeLimit = timeLimits[difficultyParam.toLowerCase()] || 5;
  
    // Variables de estado del juego
    let currentNumber = 1;
    let turnIndex = 0; // 0: jugador, 1...botsCount: BOT1, BOT2, etc.
    let timeLeft = timeLimit;
    let timer;
    let isGameOver = false;
  
    // Elementos del DOM
    const playerTurnLabel = document.getElementById('player-turn');
    const timerDisplay = document.getElementById('timer');
    const currentNumberDisplay = document.getElementById('current-number');
    const botResponseDiv = document.getElementById('bot-response');
    const gameOverPopup = document.getElementById('game-over-popup');
  
    // Botones de respuesta
    const btnFizz = document.getElementById('fizz');
    const btnBuzz = document.getElementById('buzz');
    const btnFizzBuzz = document.getElementById('fizzbuzz');
    const btnNumber = document.getElementById('number');
  
    // Eventos de respuesta (solo si es turno del jugador)
    btnFizz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('Fizz'); });
    btnBuzz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('Buzz'); });
    btnFizzBuzz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('FizzBuzz'); });
    btnNumber.addEventListener('click', () => { if (turnIndex === 0) playerAnswer(currentNumber.toString()); });
  
    // Eventos del pop-up de Game Over
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('menu-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  
    // Función para obtener la respuesta correcta según FizzBuzz
    function getCorrectAnswer(n) {
      if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
      if (n % 3 === 0) return "Fizz";
      if (n % 5 === 0) return "Buzz";
      return n.toString();
    }
  
    // Actualiza el display del número actual
    function updateCurrentNumber() {
      currentNumberDisplay.textContent = currentNumber;
      btnNumber.textContent = currentNumber; // El botón "Número" muestra el número actual
    }
  
    // Actualiza el indicador de turno
    function updateTurnLabel() {
      if (turnIndex === 0) {
        playerTurnLabel.textContent = "Tú";
      } else {
        playerTurnLabel.textContent = `BOT${turnIndex}`;
      }
    }
  
    // Inicia el temporizador (solo en turno del jugador)
    function startTimer() {
      clearInterval(timer);
      timeLeft = timeLimit;
      timerDisplay.textContent = `${timeLeft}s`;
      timer = setInterval(() => {
        if (--timeLeft < 0) {
          clearInterval(timer);
          gameOver();
        } else {
          timerDisplay.textContent = `${timeLeft}s`;
        }
      }, 1000);
    }
  
    // Función para pasar al siguiente turno
    function nextTurn() {
      // Avanzar el turno de forma cíclica
      turnIndex = (turnIndex + 1) % (botsCount + 1);
      updateTurnLabel();
      // Si es turno del jugador, actualizar display y reiniciar temporizador
      if (turnIndex === 0) {
        updateCurrentNumber();
        startTimer();
      } else {
        // Turno de un bot
        setTimeout(() => {
          botAnswer();
        }, 1000);
      }
    }
  
    // Función para el turno del jugador
    function playerAnswer(answer) {
      clearInterval(timer);
      const correct = getCorrectAnswer(currentNumber);
      if (answer.toLowerCase() === correct.toLowerCase()) {
        currentNumber++;
        nextTurn();
      } else {
        gameOver();
      }
    }
  
    // Función para que un bot responda (siempre correcto)
    function botAnswer() {
      const correct = getCorrectAnswer(currentNumber);
      // Mostrar mensaje de respuesta del bot
      botResponseDiv.textContent = `BOT${turnIndex} dice: ${correct}`;
      botResponseDiv.classList.remove('hidden');
      setTimeout(() => {
        botResponseDiv.classList.add('hidden');
        currentNumber++;
        updateCurrentNumber();
        nextTurn(); // Luego de la respuesta del bot, pasa al siguiente turno
      }, 1500);
    }
  
    // Función de Game Over
    function gameOver() {
      isGameOver = true;
      clearInterval(timer);
      gameOverPopup.classList.remove('hidden');
    }
  
    // Función para reiniciar el juego
    function restartGame() {
      isGameOver = false;
      currentNumber = 1;
      turnIndex = 0;
      gameOverPopup.classList.add('hidden');
      updateCurrentNumber();
      updateTurnLabel();
      startTimer();
    }
  
    // Iniciar el juego al cargar la página
    window.onload = () => {
      updateCurrentNumber();
      updateTurnLabel();
      startTimer();
    };
  })();
  