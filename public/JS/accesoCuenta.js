document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Obtiene y convierte el valor a booleano

    if (!isLoggedIn) {
        window.location.href = '../pages/login2.html'; // Redirige al formulario de login
    }
});