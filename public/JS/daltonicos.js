document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggleButton = document.getElementById("toggle-daltonico");

    // Cargar el estado del modo daltónico desde Local Storage
    const isDaltonicoEnabled = sessionStorage.getItem("modo-daltonico") === "true";

    if (isDaltonicoEnabled) {
        body.classList.add("modo-daltonico");
    }

    // Alternar el modo daltónico al hacer clic en el botón
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("modo-daltonico");

        // Guardar el estado en Local Storage
        const isEnabled = body.classList.contains("modo-daltonico");
        sessionStorage.setItem("modo-daltonico", isEnabled);
    });
});