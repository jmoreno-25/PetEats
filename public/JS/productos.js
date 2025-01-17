async function cargarProductos(tipo) {
    try {
        
        const response = await fetch(`/productos${tipo}`);
        console.log(`/productos${tipo}`);
        console.log('Respuesta del servidor:', response); // Verifica si hay respuesta

        if (response.ok) {
            const data = await response.json();
            console.log('Datos recibidos:', data); // Verifica si los datos son correctos
            renderizarProductos(data.productos);
        } else {
            console.error('Error al obtener productos:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}
function renderizarProductos(productos) {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = ''; // Limpia el contenedor antes de agregar productos

    productos.forEach(producto => {
        console.log('Producto procesado:', producto); // Debugging: Verifica que estás recorriendo los productos

        // Convertir el precio a número
        const precio = parseFloat(producto.prd_precio);
        
        
        // Crear el contenedor del producto
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('product-page');

        // Agregar contenido dinámico del producto
        productoDiv.innerHTML = `
            <!-- Imagen del producto -->
            <div class="product-image">
                <img src="${producto.prd_imagen}" alt="${producto.prd_nombre}">
            </div>

            <!-- Detalles del producto -->
            <div class="product-details">
                <h1>${producto.prd_nombre}</h1>
                <p>Precio: <span class="price">$${precio.toFixed(2)}</span></p>
                <p>${producto.prd_descripcion}</p>

                <!-- Botones -->
                <div class="product-actions">
                    <label for="quantity-${producto.prd_id}">Cantidad:</label>
                    <select id="quantity">
                        ${[...Array(producto.prd_stock).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                    </select>
                    <button class="add-to-cart" onclick="handleAddToCart('${producto.prd_id}','${producto.prd_nombre}', ${precio}, '${producto.prd_imagen}', 'quantity')">Agregar al carrito</button>
                </div>
            </div>
        `;

        // Añadir el producto al contenedor principal
        contenedor.appendChild(productoDiv);
    });
}
function handleAddToCart(productId,productName, productPrice, productImage, quantityId) {
    // Obtener la cantidad seleccionada del producto usando el ID del <select>
    const productQuantity = parseInt(document.getElementById(quantityId).value);
    // Llamar a la función addToCart con los datos del producto
    addToCart(productId,productName, productPrice, productImage, productQuantity);
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
function addToCart(productId,productName, productPrice, productImage, productQuantity) {
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
            id:productId,
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
// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener la ruta actual de la página
    const path = window.location.pathname;

    if (path.includes('/pages/gatos.html')) {
        cargarProductos('gatos');
    } else if (path.includes('/pages/perros.html')) {
        cargarProductos('perros');
    } else if (path.includes('/pages/aves.html')) {
        cargarProductos('aves');
    } else if (path.includes('/pages/hamster.html')) {
        cargarProductos('hamsters');
    } else {
        console.log('No se cargaron productos porque no es una página de productos.');
    }
});