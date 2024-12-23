document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Obtiene y convierte el valor a booleano

    if (!isLoggedIn) {
        alert('Debes iniciar sesión para acceder al carrito.');
        window.location.href = '../pages/login.html'; // Redirige al formulario de login
    }
});