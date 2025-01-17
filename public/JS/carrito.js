// Recuperar carrito desde Local Storage
let cart = [];
const storedCart = localStorage.getItem("cart");
if (storedCart) {
    try {
        cart = JSON.parse(storedCart);
        console.log("Carrito cargado desde Local Storage:", cart);
    } catch (error) {
        console.error("Error al parsear el Local Storage:", error);
        cart = [];
    }
} else {
    console.log("No se encontraron datos en el Local Storage. Inicializando carrito vacío.");
}

// Seleccionar elementos del DOM
const cartCountElement = document.getElementById("cart-count");
const cartItemsElement = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");
const clearCartButton = document.getElementById("clear-cart");
const subtotalAmountElement = document.getElementById("subtotal-amount");
const ivaAmountElement = document.getElementById("iva-amount");
const totalAmountElement = document.getElementById("total-amount");

// Función para mostrar los productos del carrito
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
        cart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            cartItemsElement.appendChild(li);

            subtotal += item.price * item.quantity;
        });

        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        subtotalAmountElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        ivaAmountElement.textContent = `IVA: $${iva.toFixed(2)}`;
        totalAmountElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

// Función para agregar un producto al carrito
function addToCart(productId,productName, productPrice, productImage, productQuantity) {
    if (!productQuantity || productQuantity <= 0) productQuantity = 1;

    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity += productQuantity;
    } else {
        cart.push({ id: productId,name: productName, price: productPrice, image: productImage, quantity: productQuantity });
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
