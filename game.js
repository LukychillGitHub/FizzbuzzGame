(function() {
    // Recuperar parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    // Usamos "difficulty" y "bots" (de tu menú no se modifica)
    const difficultyParam = urlParams.get('difficulty') || 'normal';  // "easy", "normal", "hard"
    const botsCount = parseInt(urlParams.get('bots')) || 1;             // Número de bots
  
    // Mapear dificultad a tiempo (en segundos)
    const timeLimits = {
      'easy': 10,
      'normal': 5,
      'hard': 3
    };
    const timeLimit = timeLimits[difficultyParam.toLowerCase()] || 5;
  
    // Variables de estado del juego
    let currentNumber = 1;
    let turnIndex = 0; // 0: jugador, 1 a botsCount: BOT1, BOT2, ...
    let timeLeft = timeLimit;
    let timer;
    let isGameOver = false;
  
    // Elementos del DOM (asegúrate de que estos IDs coincidan en tu HTML)
    const playerTurnLabel = document.getElementById('player-turn');
    const timerDisplay = document.getElementById('timer');
    const currentNumberDisplay = document.getElementById('current-number');
    const botResponseDiv = document.getElementById('bot-response');
    const gameOverPopup = document.getElementById('gameover'); // en tu HTML el div de Game Over tiene id "gameover"
  
    // Botones de respuesta
    const btnFizz = document.getElementById('fizz');
    const btnBuzz = document.getElementById('buzz');
    const btnFizzBuzz = document.getElementById('fizzbuzz');
    const btnNumber = document.getElementById('number');
  
    // Asignar eventos de respuesta (solo si es turno del jugador)
    btnFizz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('Fizz'); });
    btnBuzz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('Buzz'); });
    btnFizzBuzz.addEventListener('click', () => { if (turnIndex === 0) playerAnswer('FizzBuzz'); });
    btnNumber.addEventListener('click', () => { if (turnIndex === 0) playerAnswer(currentNumber.toString()); });
  
    // Eventos del pop-up de Game Over (asumiendo que en tu HTML tienes botones con estos IDs)
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('menu-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  
    // Función para obtener la respuesta correcta según las reglas de FizzBuzz
    function getCorrectAnswer(n) {
      if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
      if (n % 3 === 0) return "Fizz";
      if (n % 5 === 0) return "Buzz";
      return n.toString();
    }
  
    // Actualiza el display del número actual y el texto del botón "Número"
    function updateCurrentNumber() {
      currentNumberDisplay.textContent = currentNumber;
      btnNumber.textContent = currentNumber;
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
  
    // Reinicia el temporizador
    function resetTimer() {
      startTimer();
    }
  
    // Pasa al siguiente turno de forma cíclica
    function nextTurn() {
      // Incrementa el turno en la secuencia: 0 (jugador), 1..botsCount (bots)
      turnIndex = (turnIndex + 1) % (botsCount + 1);
      updateTurnLabel();
      // Si es turno del jugador, actualizar display y reiniciar temporizador
      if (turnIndex === 0) {
        updateCurrentNumber();
        resetTimer();
      } else {
        // Turno de un bot: esperar 1 segundo y ejecutar botTurn()
        setTimeout(botTurn, 1000);
      }
    }
  
    // Función para manejar la respuesta del jugador
    function playerAnswer(answer) {
      clearInterval(timer);
      const correct = getCorrectAnswer(currentNumber);
      if (answer.toLowerCase() === correct.toLowerCase()) {
        // Respuesta correcta: avanza el número y pasa al siguiente turno
        currentNumber++;
        nextTurn();
      } else {
        gameOver();
      }
    }
  
    // Función para el turno del bot (siempre responde correctamente)
    function botTurn() {
      const correct = getCorrectAnswer(currentNumber);
      // Mostrar mensaje de respuesta del bot (por ejemplo, en un div)
      botResponseDiv.textContent = `BOT${turnIndex} dice: ${correct}`;
      botResponseDiv.classList.remove('hidden');
      setTimeout(() => {
        botResponseDiv.classList.add('hidden');
        currentNumber++;
        updateCurrentNumber();
        nextTurn(); // Luego de la respuesta del bot, pasa al siguiente turno
      }, 1500);
    }
  

   // Función de Game Over: se muestra el pop-up
    function gameOver() {
        isGameOver = true;
        clearInterval(timer);
        gameOverPopup.classList.add('visible'); // Usamos visible para mostrar el pop-up
    }
  
    // Función para reiniciar el juego (manteniendo la dificultad y cantidad de bots)
    function restartGame() {
        isGameOver = false;
        currentNumber = 1;
        turnIndex = 0;
        gameOverPopup.classList.remove('visible'); // Ocultamos el pop-up
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
  