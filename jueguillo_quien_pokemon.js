//Jueguillo :D//
// Variables
let currentPokemon = null;
let score = 0;
let attempts = 0;
let pokemonList = [];

// Elementos del jueguillo
const silhouetteImg = document.getElementById('silhouette-img');
const optionsContainer = document.getElementById('game-options');
const feedbackElement = document.getElementById('game-feedback');
const scoreElement = document.getElementById('score');
const attemptsElement = document.getElementById('attempts');
const newPokemonBtn = document.getElementById('new-pokemon-btn');

// InicioOOo del jueguillo
async function initGame() {
    // Carga la lista de Pokémon
    const responses = await Promise.all(
        Array.from({length: 151}, (_, i) => 
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then(res => res.json())
    ));
    
    pokemonList = responses.map(p => ({
        id: p.id,
        name: p.name,
        image: p.sprites.other["official-artwork"].front_default
    }));
    
    // Empezar juego
    newPokemonBtn.addEventListener('click', startGame);
    startGame();
}

// Comenzar nuevo juego
function startGame() {
    // Seleccionar Pokémon aleatorio
    currentPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    
    // Mostrar silueta
    silhouetteImg.src = currentPokemon.image;
    silhouetteImg.classList.remove('revealed');
    feedbackElement.textContent = '';
    
    // Generar opciones
    const options = [currentPokemon];
    while (options.length < 4) {
        const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        if (!options.some(p => p.id === randomPokemon.id)) {
            options.push(randomPokemon);
        }
    }
    
    // Mezclar opciones
    options.sort(() => Math.random() - 0.5);
    
    // Mostrar opciones
    optionsContainer.innerHTML = '';
    options.forEach(pokemon => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        button.addEventListener('click', () => checkAnswer(pokemon));
        optionsContainer.appendChild(button);
    });
}

// Verificar respuesta
function checkAnswer(selectedPokemon) {
    attempts++;
    attemptsElement.textContent = attempts;
    
    const optionButtons = document.querySelectorAll('.option-btn');
    
    if (selectedPokemon.id === currentPokemon.id) {
        // Respuesta correcta
        feedbackElement.textContent = 'En efectivo, mi estimado :D, es correcto';
        feedbackElement.style.color = 'green';
        score++;
        scoreElement.textContent = score;
        
        // Muestra la imagen
        silhouetteImg.classList.add('revealed');
        
        // Resalta botones
        optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            if (btn.textContent.toLowerCase() === currentPokemon.name) {
                btn.classList.add('correct');
            }
        });
        
        // Deshabilitar botones
        optionButtons.forEach(btn => {
            btn.disabled = true;
        });
    } else {
        // Respuesta incorrecta
        feedbackElement.textContent = 'Pi pi pi, no es correcto';
        feedbackElement.style.color = 'red';
        
        // Resaltar botón incorrecto
        optionButtons.forEach(btn => {
            if (btn.textContent.toLowerCase() === selectedPokemon.name) {
                btn.classList.add('incorrect');
            }
        });
    }
}

// Iniciar el juego cuando la página cargue
document.addEventListener('DOMContentLoaded', initGame);