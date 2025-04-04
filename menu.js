document.addEventListener("DOMContentLoaded", function () {
    let selectedBots = null;
    let selectedDifficulty = null;

    // Deshabilitar el botón de "Jugar" al inicio
    const playButton = document.getElementById("play-button");
    playButton.disabled = true;

    // Manejo de selección de bots (Solo uno a la vez)
    document.querySelectorAll(".bot-selection button").forEach(button => {
        button.addEventListener("click", function () {
            selectedBots = parseInt(this.dataset.bots);
            document.querySelectorAll(".bot-selection button").forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");

            // Activar el botón de jugar si ambos valores están seleccionados
            playButton.disabled = !selectedBots || !selectedDifficulty;
        });
    });

    // Manejo de selección de dificultad (Solo uno a la vez con colores correctos)
    document.querySelectorAll(".difficulty-selection button").forEach(button => {
        button.addEventListener("click", function () {
            // Quitar la selección de todos los botones
            document.querySelectorAll(".difficulty-selection button").forEach(btn => {
                btn.classList.remove("selected");
                btn.style.background = "#555"; // Resetear color
                btn.style.color = "white"; // Resetear texto
            });

            // Asignar el color correspondiente al seleccionado
            selectedDifficulty = this.dataset.difficulty;
            this.classList.add("selected");

            if (selectedDifficulty === "easy") {
                this.style.background = "#4CAF50"; // Verde
            } else if (selectedDifficulty === "normal") {
                this.style.background = "#FFEB3B"; // Amarillo
                this.style.color = "black";
            } else if (selectedDifficulty === "hard") {
                this.style.background = "#F44336"; // Rojo
            }

            // Activar el botón de jugar si ambos valores están seleccionados
            playButton.disabled = !selectedBots || !selectedDifficulty;
        });
    });

    // Botón de jugar
    playButton.addEventListener("click", function () {
        if (!selectedBots || !selectedDifficulty) {
            alert("Por favor, selecciona la cantidad de bots y la dificultad antes de jugar.");
            return;
        }
        
        // Limpiar cualquier estado previo del juego
        sessionStorage.removeItem("gameState");
        window.location.href = `game.html?bots=${selectedBots}&difficulty=${selectedDifficulty}`;
    });

    // Botón de reglas del juego
    document.getElementById("rules-button").addEventListener("click", function () {
        // Cambiar el contenido del popup para que sea más legible
        const popupContent = `
            <h2>Reglas del Juego</h2>
            <ul>
                <li>Selecciona la cantidad de bots.</li>
                <li>Selecciona la dificultad.</li>
                <li>El número en pantalla te indica qué debes decir.</li>
                <li>Si el número es múltiplo de 3, toca 'FIZZ'.</li>
                <li>Si el número es múltiplo de 5, toca 'BUZZ'.</li>
                <li>Si es múltiplo de ambos, toca 'FIZZBUZZ'.</li>
                <li>Si no es múltiplo de ninguno, toca el número.</li>
                <li>¡No te equivoques o perderás!</li>
            </ul>
        `;

        // Mostrar el popup con las reglas
        showPopup(popupContent);
    });

    // Función para mostrar el popup con las reglas
    function showPopup(content) {
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Cerrar el popup al hacer clic fuera de él
        popup.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
        popupContent.innerHTML = content;

        popup.appendChild(popupContent);
        document.body.appendChild(popup);
    }
});
