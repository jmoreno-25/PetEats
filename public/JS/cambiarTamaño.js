function cambiarTamanioTexto(accion) {
    const content = document.getElementsByClassName("sobre-nosotros-container");
    let fontSize = parseInt(window.getComputedStyle(content).fontSize);

    if (accion === "aumentar") {
        fontSize += 2; // Aumenta el tamaño
    } else if (accion === "disminuir") {
        fontSize -= 2; // Disminuye el tamaño
    }

    content.style.fontSize = fontSize + "px";

    // Guarda el tamaño actual en sessionStorage
    sessionStorage.setItem("fontSize", fontSize);
}

// Recuperar el tamaño guardado al cargar la página
window.onload = function () {
    const savedFontSize = sessionStorage.getItem("fontSize");
    if (savedFontSize) {
        document.getElementById("content").style.fontSize = savedFontSize + "px";
    }
};