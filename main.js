const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const modal = document.getElementById('pokemon-modal');

// Cargar Pokemon al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarPokemonEnOrden();
});

// Función principal para cargar Pokémon
async function cargarPokemonEnOrden() {
    listaPokemon.innerHTML = '<p class="loading">Cargando Pokémon...</p>';
    
    try {
        const pokemones = await Promise.all(
            Array.from({length: 151}, (_, i) => 
                fetch(URL + (i + 1)).then(res => res.json())
        ));
        
        listaPokemon.innerHTML = '';
        pokemones.sort((a, b) => a.id - b.id).forEach(mostrarPokemon);
    } catch (error) {
        listaPokemon.innerHTML = '<p class="error">Error al cargar Pokemon</p>';
        console.error("Error:", error);
    }
}

// La función oara que muestre cada Pokémon
function mostrarPokemon(poke) {
    const tipos = poke.types.map(type => 
        `<p class="${type.type.name} tipo">${type.type.name.toUpperCase()}</p>`
    ).join('');

    const pokeId = poke.id.toString().padStart(3, '0');
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" loading="lazy">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${(poke.height/10).toFixed(1)}m</p>
                <p class="stat">${(poke.weight/10).toFixed(1)}kg</p>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => mostrarDetallesPokemon(poke));
    listaPokemon.append(div);
}

// Es la función para mostrar detallitos del Pokémon
async function mostrarDetallesPokemon(pokemon) {
    try {
        // Mostrar loader en el modal
        document.getElementById('modal-pokemon-description').textContent = 'Cargando...';
        document.getElementById('modal-pokemon-evolutions').innerHTML = 'Cargando...';
        document.getElementById('modal-pokemon-stats').innerHTML = 'Cargando...';
        
        // Mostrar información del pokemon
        document.getElementById('modal-pokemon-img').src = pokemon.sprites.other["official-artwork"].front_default;
        document.getElementById('modal-pokemon-name').textContent = pokemon.name.toUpperCase();
        document.getElementById('modal-pokemon-id').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        
        // Mostrar tipos
        const typesContainer = document.getElementById('modal-pokemon-types');
        typesContainer.innerHTML = '';
        pokemon.types.forEach(type => {
            const typeElement = document.createElement('p');
            typeElement.className = `${type.type.name} tipo`;
            typeElement.textContent = type.type.name.toUpperCase();
            typesContainer.appendChild(typeElement);
        });
        
        // Obtener datos adicionales
        const [speciesData, evolutionData] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`).then(res => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`).then(res => res.json())
        ]);
        
        // Mostrar descripción
        const description = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'es'
        )?.flavor_text || 'Descripción no disponible';
        document.getElementById('modal-pokemon-description').textContent = description.replace(/\f/g, ' ');
        
        // Mostrar estadísticas
        const statsContainer = document.getElementById('modal-pokemon-stats');
        statsContainer.innerHTML = '';
        pokemon.stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat-bar';
            statElement.innerHTML = `
                <span class="stat-name">${stat.stat.name.toUpperCase().replace('-', ' ')}</span>
                <span class="stat-value">
                    <span class="stat-fill" style="width: ${(stat.base_stat / 255) * 100}%; 
                    background-color: var(--type-${pokemon.types[0].type.name})"></span>
                </span>
                <span>${stat.base_stat}</span>
            `;
            statsContainer.appendChild(statElement);
        });
        
        // Mostrar los: Sabías queeeee...
        const funFacts = [
            `Especie: ${speciesData.genera.find(g => g.language.name === 'es')?.genus || 'Desconocida'}`,
            `Habitat: ${(speciesData.habitat?.name || 'Desconocido').toUpperCase()}`,
            `Tasa de captura: ${speciesData.capture_rate}`,
            `Color: ${(speciesData.color?.name || 'Desconocido').toUpperCase()}`
        ];
        document.getElementById('modal-pokemon-funfact').innerHTML = funFacts.map(fact => `• ${fact}`).join('<br>');
        
        // Muestra sus evoluciones
        const evolutionsContainer = document.getElementById('modal-pokemon-evolutions');
        evolutionsContainer.innerHTML = '<p>Función de evoluciones en desarrollo</p>';
        
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        document.getElementById('modal-pokemon-description').textContent = 'Error al cargar información';
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Cerrar modal
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => event.target === modal && (modal.style.display = 'none');
}

// Los filtra dependiendo de su tipo
botonesHeader.forEach(boton => {
    boton.addEventListener('click', async (event) => {
        const botonId = event.currentTarget.id;
        
        try {
            listaPokemon.innerHTML = '<p class="loading">Filtrando...</p>';
            const allPokemon = await Promise.all(
                Array.from({length: 151}, (_, i) => 
                    fetch(URL + (i + 1)).then(res => res.json())
            ));
            
            listaPokemon.innerHTML = '';
            
            const filtered = botonId === "ver-todos" 
                ? allPokemon 
                : allPokemon.filter(p => p.types.some(t => t.type.name === botonId));
            
            filtered.sort((a, b) => a.id - b.id).forEach(mostrarPokemon);
        } catch (error) {
            listaPokemon.innerHTML = '<p class="error">Error al filtrar</p>';
            console.error("Error:", error);
        }
    });
});


