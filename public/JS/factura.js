
async function enviarFactura() {
    try {
        const cliCedulaRuc = document.getElementById('cedula').value;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const direccion = document.getElementById('address').value;
        const provincia = document.getElementById('provincia').value;
        const ciudad = document.getElementById('ciudad').value;
        const codigoPostal = document.getElementById('zip').value;
        if (!cliCedulaRuc || cart.length === 0 || !direccion || !provincia || !ciudad || !codigoPostal) {
            alert('Por favor complete todos los datos requeridos.');
            return;
        }   

       const productos = cart.map(item => ({
            prd_id: item.id, // Asegúrate de que este campo exista
            cantidad: item.quantity,
            precio: item.price
        }));

        const response = await fetch('/crear-factura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cli_cedula_ruc: cliCedulaRuc, 
                direccion: {
                    direccion,
                    provincia,
                    ciudad,
                    codigoPostal
                },
                productos 
            })
            
        });
        const data = await response.json();
            alert(`Factura creada con éxito. Número: ${data.factura.fac_numero}`);
            clearCart();    
    } catch (error) {
        console.error('Error al enviar la factura:', error);
        alert('Hubo un error al procesar la factura. Por favor, inténtelo nuevamente.');
    }
}
// Función para vaciar el carrito
function clearCart() {
    localStorage.setItem("cart", JSON.stringify([])); // Vaciar en localStorage
    updateCartCount(); // Actualizar el contador
    displayCart(); // Renderizar el carrito vacío
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;  
}
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Leer el carrito actualizado
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
            // Crear y renderizar cada producto (como ya lo haces)
            const productContainer = document.createElement("div");
            productContainer.style.display = "flex";
            productContainer.style.flexDirection = "column"; 
            productContainer.style.alignItems = "center";
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