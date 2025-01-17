function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
let productoActual = '';
let descripcionActual = '';
let imagenesActuales = [];
let imagenPrincipal = '';

function abrirModal(nombreProducto, descripcion, imagenes) {
    productoActual = nombreProducto;
    descripcionActual = descripcion;
    imagenesActuales = imagenes;

            // Mostrar el modal
    document.getElementById("modal").style.display = "flex";
            
            // Establecer la primera imagen como principal
    imagenPrincipal = imagenes[0];
    document.getElementById("main-img").src = imagenPrincipal;

            // Mostrar la descripción
    document.getElementById("modal-desc").textContent = descripcion;

            // Generar las imágenes en miniatura
            const contenedorMiniaturas = document.getElementById("modal-img-container");
            contenedorMiniaturas.innerHTML = '';
            imagenes.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.className = "modal-img" + (index === 0 ? " active" : "");
                img.onclick = function() {
                    seleccionarImagenPrincipal(imgSrc);
                };
                contenedorMiniaturas.appendChild(img);
            });
}

function seleccionarImagenPrincipal(src) {
    imagenPrincipal = src;
    document.getElementById("main-img").src = src;
    // Actualizar la clase activa en las miniaturas
    const miniaturas = document.querySelectorAll(".modal-img");
    miniaturas.forEach(img => img.classList.remove("active"));
    document.querySelector('.modal-img[src="${src}"]').classList.add("active");
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

function comprarProducto() {
    const cantidad = document.getElementById("cantidad").value;
    alert("Has comprado " + cantidad + " unidad(es) de " + productoActual);
}

let currentIndex = 0;

function moveSlide(direction) {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// carrito
// Carrito de compras
 // Cargar carrito desde Local Storage
 let cart = JSON.parse(localStorage.getItem("cart")) || [];

 // Seleccionar elementos del DOM
 const cartCountElement = document.getElementById("cart-count");

 function handleAddToCart(productName, productPrice, productImage, quantityId) {
    console.log(quantityId);
    // Obtener la cantidad seleccionada del producto usando el ID del <select>
    const productQuantity = parseInt(document.getElementById(quantityId).value);
    
    // Llamar a la función addToCart con los datos del producto
    addToCart(productName, productPrice, productImage, productQuantity);
     Swal.fire({
        title: 'Producto añadido',
        text: 'El producto se ha añadido correctamente al carrito',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        padding: '1rem', // Reduce el padding interno
        customClass: {
            popup: 'swal-popup-custom' // Clase personalizada para ajustar estilos
        },
        backdrop: rgba(0,0,0,0.5) // Ajusta la opacidad del fondo
    });
}

// Función para agregar producto al carrito
function addToCart(productName, productPrice, productImage, productQuantity) {
    // Asegurarse de que la cantidad es un número válido
    if (!productQuantity || productQuantity <= 0) {
        productQuantity = 1; // Cantidad predeterminada
    }

    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        // Si el producto ya existe, sumar la cantidad seleccionada
        cart[productIndex].quantity += productQuantity;
    } else {
        // Si no existe, agregar el producto con la cantidad seleccionada
        cart.push({ 
            name: productName, 
            price: productPrice, 
            image: productImage, 
            quantity: productQuantity 
        });
    }

    // Guardar carrito en Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Actualizar el contador del carrito
    updateCartCount();
}
// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Guardar el contador en Local Storage
    localStorage.setItem("cartCount", totalItems);
}

// Recuperar el valor del contador al cargar la página
function loadCartCount() {
    const storedCount = localStorage.getItem("cartCount");
    if (storedCount) {
        cartCountElement.textContent = storedCount;
    } else {
        cartCountElement.textContent = 0;
    }
}

// Cargar el contador al iniciar
loadCartCount();

// Seleccionar elementos del DOM
const cartItemsElement = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");
const clearCartButton = document.getElementById("clear-cart");
const subtotalAmountElement = document.getElementById("subtotal-amount");
const ivaAmountElement = document.getElementById("iva-amount");
const totalAmountElement = document.getElementById("total-amount");

// Función para mostrar los productos del carrito
// Función para mostrar los productos del carrito en formato vertical
function displayCart() {
    cartItemsElement.innerHTML = ""; // Limpiar la lista de productos

    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío
        emptyCartMessage.style.display = "block";
        clearCartButton.style.display = "none";
        subtotalAmountElement.textContent = "";
        ivaAmountElement.textContent = "";
        totalAmountElement.textContent = "";
    } else {
        emptyCartMessage.style.display = "none";
        clearCartButton.style.display = "inline-block";

        let subtotal = 0;
        cart.forEach((item, index) => {
            // Crear un contenedor para cada producto
            const productContainer = document.createElement("div");
            productContainer.style.display = "flex";
            productContainer.style.flexDirection = "column"; // Disposición vertical
            productContainer.style.alignItems = "center"; // Centrar contenido
            productContainer.style.marginBottom = "15px";
            productContainer.style.borderBottom = "1px solid #ddd";
            productContainer.style.paddingBottom = "10px";

            // Imagen del producto
            const img = document.createElement("img");
            img.src = item.image; // URL de la imagen
            img.alt = item.name;
            img.style.width = "80%";
            img.style.height = "80%";
            img.style.marginBottom = "10px";

            // Detalles del producto
            const details = document.createElement("div");
            details.style.textAlign = "center"; // Centrar texto

            const name = document.createElement("p");
            name.textContent = `${item.name}`;
            name.style.margin = "0 0 5px 0"; // Espaciado entre líneas
            name.style.fontWeight = "bold";

            const price = document.createElement("p");
            price.textContent = `$${item.price} x ${item.quantity}`;
            price.style.margin = "0";

            // Contenedor de botones
            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.marginTop = "10px";

            // Botón para disminuir cantidad
            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.style.marginRight = "5px";
            decreaseButton.style.padding = "5px 10px";
            decreaseButton.style.cursor = "pointer";
            decreaseButton.onclick = () => updateQuantity(index, -1);

            // Cantidad actual
            const quantityDisplay = document.createElement("span");
            quantityDisplay.textContent = `${item.quantity}`;
            quantityDisplay.style.margin = "0 10px";
            quantityDisplay.style.fontWeight = "bold";

            // Botón para aumentar cantidad
            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.style.marginLeft = "5px";
            increaseButton.style.padding = "5px 10px";
            increaseButton.style.cursor = "pointer";
            increaseButton.onclick = () => updateQuantity(index, 1);

            buttonContainer.appendChild(decreaseButton);
            buttonContainer.appendChild(quantityDisplay);
            buttonContainer.appendChild(increaseButton);

            // Agregar elementos al contenedor
            details.appendChild(name);
            details.appendChild(price);
            productContainer.appendChild(img);
            productContainer.appendChild(details);
            productContainer.appendChild(buttonContainer);

            // Añadir el contenedor del producto al carrito
            cartItemsElement.appendChild(productContainer);

            // Calcular subtotal
            subtotal += item.price * item.quantity;
        });

        // Calcular IVA y total
        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        // Actualizar valores en el DOM
        subtotalAmountElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        ivaAmountElement.textContent = `IVA: $${iva.toFixed(2)}`;
        totalAmountElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

// Función para actualizar la cantidad de un producto
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;

        // Eliminar producto si la cantidad es menor a 1
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }

        // Guardar cambios en el Local Storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualizar el contador y la vista del carrito
        updateCartCount();
        displayCart();
    }
}


// Función para agregar un producto al carrito
function addToCart(productName, productPrice, productImage, productQuantity) {
    if (!productQuantity || productQuantity <= 0) productQuantity = 1;

    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity += productQuantity;
    } else {
        cart.push({ name: productName, price: productPrice, image: productImage, quantity: productQuantity });
    }

    console.log("Producto añadido:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    localStorage.setItem("cartCount", totalItems);
}

// Inicializar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando carrito...");
    updateCartCount();
    displayCart();
});





