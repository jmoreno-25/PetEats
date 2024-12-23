document.getElementById('DatosUsuario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Capturar los valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const fechaNacimiento = document.getElementById('fecha').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contraseña').value.trim();

    // Almacenar los valores en sessionStorage
    sessionStorage.setItem('nombre', nombre);
    sessionStorage.setItem('apellido', apellido);
    sessionStorage.setItem('usuario', usuario);
    sessionStorage.setItem('fechaNacimiento', fechaNacimiento);
    sessionStorage.setItem('celular', celular);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('contrasena', contrasena);
    // Puedes redirigir al usuario o realizar otra acción después de guardar los datos
    // window.location.href = '/otro-pagina.html';
});