document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const pokemonBtns = document.querySelectorAll('.pokemon-btn');
    const combatBtn = document.getElementById('combat-btn');
    const cpuSelection = document.getElementById('cpu-selection');
    const combatResult = document.getElementById('combat-result');
    const historyList = document.getElementById('history-list');
    
    // Variables del juego
    let player1Choice = null;
    let player2Choice = null;
    const options = ['charizard', 'venusaur', 'blastoise'];
    
    //botones de Pokémon
    pokemonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover selección previa
            pokemonBtns.forEach(b => b.classList.remove('selected'));
            
            // Seleccionar nuevo Pokémon
            btn.classList.add('selected');
            player1Choice = btn.dataset.pokemon;
            
            // Activar botón de combate
            combatBtn.disabled = false;
        });
    });
    
   
    combatBtn.addEventListener('click', () => {
        // Selección aleatoria
        player2Choice = options[Math.floor(Math.random() * options.length)];
        cpuSelection.textContent = player2Choice;
        cpuSelection.className = 'cpu-selection ' + player2Choice;
        
        // Determinar el resultado
        const result = determineWinner(player1Choice, player2Choice);
        
        // Mostrar resultado
        displayResult(result);
        
        // Agregar al historial
        addToHistory(result);
        
        // Desactivar botón hasta nueva selección
        combatBtn.disabled = true;
    });
    
    //Determina el ganador
    function determineWinner(p1, p2) {
        if (p1 === p2) {
            return { winner: 'draw', message: `¡Empate! Ambos usaron ${p1}` };
        }
        
        const winConditions = {
            charizard: 'venusaur',
            venusaur: 'blastoise',
            blastoise: 'charizard'
        };
        
        if (winConditions[p1] === p2) {
            return { winner: 'player1', message: `¡Jugador 1 gana! ${p1} vence a ${p2}` };
        } else {
            return { winner: 'player2', message: `¡Jugador 2 gana! ${p2} vence a ${p1}` };
        }
    }
    
    function displayResult(result) {
        combatResult.textContent = result.message;
        combatResult.className = 'combat-result ' + result.winner;
    }
    
    function addToHistory(result) {
        const li = document.createElement('li');
        li.textContent = result.message;
        li.className = result.winner;
        

        if (historyList.children.length >= 5) {
            historyList.removeChild(historyList.lastChild);
        }
        
        historyList.insertBefore(li, historyList.firstChild);
    }
});