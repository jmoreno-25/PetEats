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

console.log(cart); // Verifica que cada producto tenga una cantidad correcta (número entero)


// Seleccionar elementos del DOM
const cartItemsElement = document.getElementById("cart-items");
const carItemElement = document.getElementById("car");
const cartTitleElement = document.getElementById("cartitle");
const cartImageElement = document.getElementById("imgcar");
const totalAmountElement = document.createElement("p");
totalAmountElement.className="total-p";
const subtotalAmountElement = document.createElement("p");
subtotalAmountElement.className="total-p";
const ivaAmountElement = document.createElement("p"); // Elemento para mostrar el total
const clearCartButton = document.createElement("button"); // Botón para vaciar el carrito
const buyCartButton = document.createElement("button"); // Botón para vaciar el carrito
const divborrarcomprar = document.createElement("div");

divborrarcomprar.style.display = "flex";
divborrarcomprar.style.alignItems = "center";



// Configuración del botón "Vaciar Carrito"
clearCartButton.id = "clear-cart";
clearCartButton.textContent = "Vaciar Carrito";
clearCartButton.onclick = clearCart; // Asigna la función para vaciar el carrito
clearCartButton.style.display = "none"; // Inicialmente oculto
clearCartButton.style.marginRight = "10px";


buyCartButton.id = "comprar-car";
buyCartButton.textContent = "Comprar";
buyCartButton.onclick = () => {
    window.location.href = "../pages/comprar.html"; // Cambiar de pestaña o página
};
// Asegúrate de que ambos botones estén dentro de divborrarcomprar
divborrarcomprar.appendChild(clearCartButton);
divborrarcomprar.appendChild(buyCartButton);

// Asegurarse de que el botón "Vaciar Carrito" se agrega al contenedor si no existe
if (!cartItemsElement.parentNode.contains(divborrarcomprar)) {
    cartItemsElement.parentNode.appendChild(divborrarcomprar);
}

function displayCart() {
    cartItemsElement.innerHTML = ""; // Limpiar la lista actual de productos

    if (cart.length === 0) {
        // Si el carrito está vacío, mostrar el mensaje
        cartTitleElement.textContent = "TU CARRITO ESTÁ VACÍO...";
        cartImageElement.style.display = "block";
        cartItemsElement.style.display = "none";
        carItemElement.style.maxHeight="100%";
        // Ocultar el total y el botón de vaciar carrito
        subtotalAmountElement.textContent="";
        totalAmountElement.textContent = "";
        ivaAmountElement.textContent="";
        divborrarcomprar.style.display ="none";
        clearCartButton.style.display = "none";
        buyCartButton.style.display ="none";
    } else {
        carItemElement.style.maxHeight="80%";
        cartTitleElement.textContent = "TU CARRITO:";
        cartImageElement.style.display = "none";
        cartItemsElement.style.display = "block";

        let totalAmount = 0; // Inicializa el total en 0
        let ivaAmount = 0;
        let subtotalAmount = 0;
        cart.forEach(item => {
            const li = document.createElement("li");

            // Validar que la cantidad sea un número y que esté definida
            const quantity = item.quantity || 0;
            const subtotal = item.price *quantity ||0;
            const iva = subtotal * 0.15 ||0;
            const total = subtotal + iva || 0;

            // Crear un contenedor para la imagen y los detalles del producto
            const productContainer = document.createElement("div");
            productContainer.className ="div-car";
            productContainer.style.display = "flex";
            productContainer.style.alignItems = "center";

            // Crear la imagen del producto
            const img = document.createElement("img");
            img.className="car-adp"
            img.src = item.image;
            img.alt = item.name;
            // Crear el texto del producto (nombre, precio y cantidad)
            const productDetails = document.createElement("span");
            productDetails.className="car-span";
            productDetails.textContent = `${item.name} - $${item.price}`;
 
             // Botón "−" (Disminuir cantidad)
             const decreaseButton = document.createElement("button");
             decreaseButton.className = "remove-button";
             decreaseButton.textContent = "🗑️";
             decreaseButton.style.padding = "5px";
             decreaseButton.style.cursor = "pointer";
             decreaseButton.onclick = () => updateQuantity(item.name, -1);
            const cantidad = document.createElement("p");
            cantidad.id="p-cantidad";
            cantidad.textContent = `${quantity}`;
             // Botón "+"
            const increaseButton = document.createElement("button");
            increaseButton.id = "increase-button";
            increaseButton.textContent = "➕";
            increaseButton.style.padding = "5px";
            increaseButton.style.cursor = "pointer";
            increaseButton.onclick = () => updateQuantity(item.name, 1);
           
            decreaseButton.onclick = () => removeFromCart(item.name); // Eliminar solo este producto
            const sep = document.createElement("br");
            // Añadir la imagen, detalles y botón al contenedor
            productContainer.appendChild(img);
            productContainer.appendChild(productDetails);
            productContainer.appendChild(cantidad);
            productContainer.appendChild(decreaseButton);
            productContainer.appendChild(increaseButton);
            productContainer.appendChild(sep);
            productContainer.appendChild(sep);
            productContainer.appendChild(sep);
            productContainer.appendChild(sep);
            // Añadir el contenedor al elemento de lista
            li.appendChild(productContainer);
            cartItemsElement.appendChild(li);
            subtotalAmount += subtotal;
            ivaAmount += iva;
            totalAmount += total;
            
            
            //console.log(totalAmount);
        });
        subtotalAmountElement.textContent = `SubTotal: $${subtotalAmount.toFixed(2)}`;
        ivaAmountElement.textContent = `IVA: $${ivaAmount.toFixed(2)}`;
        totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;

        totalAmountElement.className="total-p";
        subtotalAmountElement.className="total-p";
        ivaAmountElement.className="total-p";
    }

    if (!cartItemsElement.parentNode.contains(subtotalAmountElement)) {
        cartItemsElement.parentNode.appendChild(subtotalAmountElement);
    }
    if (!cartItemsElement.parentNode.contains(ivaAmountElement)) {
        cartItemsElement.parentNode.appendChild(ivaAmountElement);
    }
    if (!cartItemsElement.parentNode.contains(totalAmountElement)) {
        cartItemsElement.parentNode.appendChild(totalAmountElement);
    }
}
// Función para actualizar la cantidad de un producto
function updateQuantity(productName, change) {
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;

        // Si la cantidad es menor a 1, eliminar el producto
        if (cart[productIndex].quantity < 1) {
            cart.splice(productIndex, 1);
        }

        // Actualizar el carrito en el Local Storage
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        displayCart(); // Actualizar la vista del carrito
    }
}


// Función para eliminar un producto del carrito
function removeFromCart(productName) {
    // Buscar el índice del producto en el carrito
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            // Si la cantidad es mayor a 1, reducir la cantidad
            cart[productIndex].quantity--;
        } else {
            // Si la cantidad es 1, eliminar el producto completamente
            cart.splice(productIndex, 1);
        }
        // Actualizar el carrito en Local Storage
        localStorage.setItem("cart", JSON.stringify(cart));
        // Actualizar el contador
        updateCartCount();
        // Actualizar la lista del carrito
        displayCart();
    }
}

// Función para vaciar el carrito
function clearCart() {
    cart = []; // Vaciar el array
    localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar Local Storage
    localStorage.setItem("cartCount", 0); // Restablecer el contador en el Local Storage
    updateCartCount(); // Actualizar el contador
    displayCart(); // Actualizar la lista del carrito
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("cartCount", totalItems); // Guardar el contador en Local Storage
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Llamar a displayCart al cargar la página
displayCart();
  



