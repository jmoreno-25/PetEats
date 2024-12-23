document.getElementById('btn-cerrarsesion').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn'); // Borra el estado de inicio de sesión
    alert('Sesión cerrada exitosamente.');
    window.location.href = '../pages/login2.html'; // Redirige al login
});