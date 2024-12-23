const video = document.getElementById('miVideo');

// Función para reproducir el video
function reproducir() {
    video.play();
}

// Función para pausar el video
function pausar() {
    video.pause();
}

// Función para silenciar el video
function silenciar() {
    video.muted = true;
}

// Función para activar el sonido
function activarSonido() {
    video.muted = false;
}
function cambiarVolumen() {
    const volumen = document.getElementById('controlVolumen').value;
    video.volume = volumen;
}
// Función para adelantar 10 segundos
function adelantar() {
    video.currentTime += 10;
}

// Función para retroceder 10 segundos
function retroceder() {
    video.currentTime -= 10;
}
function cambiarVolumen() {
    const volumen = document.getElementById('cambiarvol').value;
    video.volume = volumen;
}