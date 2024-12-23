document.getElementById('iniciarSesion').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contraseña').value.trim();

    if (!usuario || !contrasena) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    fetch('/verificar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }
            return response.json();
        })
        .then((data) => {
            if(data.message.includes('Bienvenido')){
                alert(data.message);
                localStorage.setItem('isLoggedIn', true); 
                console.log('Usuario:', data.usuario);
                window.location.href = '../pages/carrito.html';
            }
            else if(data.message.includes('Usuario no encontrado')){
                alert(data.message);
                localStorage.setItem('isLoggedIn', false); 
            }
        })  
        .catch((error) => {
            console.error('Error:', error);
            alert('Usuario no encontrado o credenciales incorrectas.');
        });
});
