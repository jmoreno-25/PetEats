function validarFormulario() {
    let esValido = true;

    // Limpia mensajes de error previos
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error", "success"));

    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const fechaNacimiento = document.getElementById('fecha').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contraseña').value.trim();
    const repetirContrasena = document.getElementById("Repetircontrasena").value.trim();

    // Validar nombre (no puede contener números)
    if (nombre === "") {
      esValido = false;
      alert("nombre", "El nombre es obligatorio.");
    } else if (/\d/.test(nombre)) {
      esValido = false;
      alert("nombre", "El nombre no puede contener números.");
    } else {
      marcarExito("nombre");
    }

    // Validar apellido (no puede contener números)
    if (apellido === "") {
      esValido = false;
      alert("apellido", "El apellido es obligatorio.");
    } else if (/\d/.test(apellido)) {
      esValido = false;
      alert("apellido", "El apellido no puede contener números.");
    } else {
      marcarExito("apellido");
    }

    // Validar usuario
    if (usuario === "") {
      esValido = false;
      alert("usuario", "El nombre de usuario es obligatorio.");
    } else {
      marcarExito("usuario");
    }

    // Validar fecha de nacimiento
    if (fechaNacimiento === "") {
      esValido = false;
      alert("fechaNacimiento", "La fecha de nacimiento es obligatoria.");
    } else {
      marcarExito("fechaNacimiento");
    }

    // Validar celular (debe comenzar con 09 y tener 10 dígitos)
    if (!/^09\d{8}$/.test(celular)) {
      esValido = false;
      alert("celular", "El número de celular debe comenzar con 09 y tener 10 dígitos.");
    } else {
      marcarExito("celular");
    }

    // Validar correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      esValido = false;
      alert("correo", "El correo no es válido.");
    } else {
      marcarExito("correo");
    }

    // Validar contraseña
    if (contrasena.length < 6) {
      esValido = false;
      alert("contrasena", "La contraseña debe tener al menos 6 caracteres.");
    } else {
      marcarExito("contrasena");
    }

    // Validar que las contraseñas coincidan
    if (contrasena !== repetirContrasena) {
      esValido = false;
      alert("repetirContrasena", "Las contraseñas no coinciden.");
    } else {
      marcarExito("repetirContrasena");
    }

    // Si todo es válido
    if (esValido) {
      alert("Formulario enviado correctamente.");
    }
  }

  function mostrarError(id, mensaje) {
    document.getElementById(id).classList.add("error");
    document.getElementById("error" + id.charAt(0).toUpperCase() + id.slice(1)).textContent = mensaje;
  }

  function marcarExito(id) {
    document.getElementById(id).classList.add("success");
  }