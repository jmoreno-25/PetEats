//crearcuenta.js
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


document.getElementById('DatosUsuario').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreusuario = document.getElementById('usuario').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contraseña').value.trim();
    const repetirContrasena =document.getElementById('Repetircontraseña').value.trim();
    const cli_nombre = document.getElementById('nombre').value.trim();
    const cli_apellido = document.getElementById('apellido').value.trim();
    const cli_correo = document.getElementById('email').value.trim();
    const cli_edad = document.getElementById('fecha').value.trim();
    const cli_celular = document.getElementById('celular').value.trim();

    // Validar los campos
    if (!cli_nombre || !validateName(cli_nombre)) {
        alert("Por favor, ingrese un nombre válido (sin números ni caracteres especiales).");
        return;
    }
    if (!cli_apellido || !validateName(cli_apellido)) {
        alert("Por favor, ingrese un apellido válido (sin números ni caracteres especiales).");
        return;
    }
    if (!cli_correo || !validateEmail(cli_correo)) {
        alert("Por favor, ingrese un correo electrónico válido (debe contener texto, @ y dominio).");
        return;
    }
    if (!cli_celular || !validatePhone(cli_celular)) {
        alert("Por favor, ingrese un número de teléfono válido (10 dígitos).");
        return;
    }
    if (contrasena !== repetirContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    function validateName(name) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/; // Permite letras (mayúsculas, minúsculas) y espacios, con tildes
        return regex.test(name);
    }
    
    
    // Función para validar el correo electrónico
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Formato básico de correo
        return regex.test(email);
    }
    
    // Función para validar el teléfono (10 dígitos)
    function validatePhone(phone) {
        const regex = /^[0-9]{10}$/; // Solo 10 dígitos numéricos
        return regex.test(phone);
    }
    
    sessionStorage.setItem('nombre', cli_nombre);
    sessionStorage.setItem('apellido', cli_apellido);
    sessionStorage.setItem('usuario', nombreusuario);
    sessionStorage.setItem('fechaNacimiento', cli_edad);
    sessionStorage.setItem('celular', cli_celular);
    sessionStorage.setItem('email', cli_correo);
    sessionStorage.setItem('contrasena', contrasena);
    sessionStorage.setItem('Repetircontrasena', repetirContrasena);

    fetch('/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombreusuario, 
            email, 
            contrasena, 
            cli_nombre, 
            cli_apellido, 
            cli_correo, 
            cli_edad, 
            cli_celular 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data); // Depura la respuesta
    
        if (data.usuarioId) {
            alert(data.message);
            // Redirige pasando usuarioId correctamente
            window.location.href = `../pages/datos-envio.html?usuario_id=${data.usuarioId}`;
        } else {
            alert('Error: No se pudo generar el usuario.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al procesar la solicitud.');
    });
});

