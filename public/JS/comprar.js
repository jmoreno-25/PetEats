const ciudades = {
    "Azuay": ["Cuenca", "Girón", "Paute", "Azogues", "Chordeleg", "Sígsig", "San Fernando"],
    "Pichincha": ["Quito", "Rumiñahui", "Mejía", "Pedro Moncayo", "Puerto Quito", "Cayambe", "Valle de los Chillos"],
    "Guayas": ["Guayaquil", "Durán", "Samborondón", "Baba", "Milagro", "Naranjal", "Playas", "Naranjito", "Salitre"],
    "Manabí": ["Portoviejo", "Manta", "Jipijapa", "Chone", "Pedernales", "El Carmen", "Rocafuerte", "Tosagua", "Sucre"],
    "El Oro": ["Machala", "Pasaje", "Santa Rosa", "Arenillas", "Piñas", "Huaquillas"],
    "Tungurahua": ["Ambato", "Baños", "Patate", "Cevallos", "Tisaleo", "Pelileo"],
    "Loja": ["Loja", "Catamayo", "Zapotillo", "Celica", "Pindal", "Macará", "Saraguro"],
    "Cotopaxi": ["Latacunga", "Salcedo", "Santiago de Quito", "Pujilí", "La Maná"],
    "Carchi": ["Tulcán", "Espejo", "Montúfar", "Mira", "San Pedro de Huaca"],
    "Imbabura": ["Ibarra", "Otavalo", "Cotacachi", "Antonio Ante", "Urcuquí"],
    "Chimborazo": ["Riobamba", "Alausí", "Chanchán", "Guano", "Chimborazo", "San Andrés"],
    "Esmeraldas": ["Esmeraldas", "Atacames", "Muisne", "Río Verde", "Tonchigüe"],
    "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia", "Valencia"],
    "Los Ríos": ["Babahoyo", "Quevedo", "Ventanas", "Mocache", "Río Verde", "Urbina"],
    "Sucumbíos": ["Nueva Loja", "Cascales", "Lago Agrio", "Shushufindi", "Cuyabeno"],
    "Orellana": ["Francisco de Orellana", "La Joya de los Sachas", "El Coca", "Loreto"],
    "Napo": ["Tena", "Archidona", "Coca", "Misahuallí", "Ahuano", "El Chaco"],
    "Morona Santiago": ["Macas", "Gualaquiza", "Santiago de Méndez", "Sucúa", "Yantzaza"],
    "Zamora-Chinchipe": ["Zamora", "Loja", "Chinchipe", "Cariamanga"],
    "Galápagos": ["Puerto Ayora", "Puerto Baquerizo Moreno", "Isabela"],
    "Bolívar": ["Guaranda", "Chillanes", "Echeandía"],
    "Cañar": ["Azogues", "Biblián", "Cañar", "La Troncal"],
    "Pastaza": ["Puyo", "Mera", "Santa Clara"]
};

function actualizarCiudades() {
    const provinciaSeleccionada = document.getElementById('provincia').value;
    const ciudadSelect = document.getElementById('ciudad');
    ciudadSelect.innerHTML = '<option value="">Seleccionar Ciudad</option>';

    if (provinciaSeleccionada) {
        const ciudadesDisponibles = ciudades[provinciaSeleccionada];
        ciudadesDisponibles.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            ciudadSelect.appendChild(option);
        });
    }
}

