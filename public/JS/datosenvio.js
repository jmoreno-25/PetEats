//datosenvio.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea, select');

    // Restaurar los valores del formulario desde sessionStorage
    inputs.forEach((input) => {
        const savedValue = sessionStorage.getItem(input.name);
        if (savedValue) {
            input.value = savedValue
        }
    });

    // Guardar los valores del formulario en sessionStorage
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
                sessionStorage.setItem(input.name, input.value);
            
        });
    });

    // Limpiar sessionStorage cuando se envía el formulario
    form.addEventListener('submit', () => {
        sessionStorage.clear();
    });
});

document.getElementById('DatosEnvio').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener usuario_id desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const usuario_id = urlParams.get('usuario_id');
    console.log(usuario_id);
    const provincia = document.getElementById('provincia').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const codigopostal = document.getElementById('codigopostal').value.trim();
    sessionStorage.setItem('provincia', provincia);
    sessionStorage.setItem('ciudad', ciudad);
    sessionStorage.setItem('direccion', direccion);
    sessionStorage.setItem('codigopostal', codigopostal);
    fetch('/datos-envio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, provincia, ciudad, direccion, codigopostal})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes("Datos de envío guardados exitosamente")) {
            alert(data.message);
            // Opcional: Redirigir a una página de confirmación o inicio
            window.location.href = '/index.html';
        }
        else if(data.message.includes("Error al guardar datos de envío")){
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});