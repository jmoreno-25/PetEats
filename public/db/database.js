require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Importar el módulo pg para PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;
const host=process.env.HOST || 'localhost';
// Middleware para parsear JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde una carpeta específica
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000
});

// Funciones de consultas a la base de datos

// Obtener el próximo ID de cliente
async function getNextClientId() {
    const query = 'SELECT MAX(CLI_ID) AS lastId FROM CLIENTE';
    const [rows] = await pool.query(query);
    const lastId = rows[0]?.lastId;

    if (lastId) {
        const numericPart = parseInt(lastId.substring(1), 10);
        return `C${String(numericPart + 1).padStart(5, '0')}`;
    }
    return 'C00001';
}

// Registrar un cliente
async function insertClient(values) {
    const query = `
        INSERT INTO CLIENTE (
            CLI_ID, CLI_NOMBRE, CLI_APELLIDO, CLI_FECHANACIMIENTO, CLI_CORREO, CLI_SEXO,
            CLI_DIRECCION, CLI_CLAVE, CLI_CEDULA, CLI_TELEFONO, CLI_SECTOR
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, values);
}

// Validar inicio de sesión
async function validateLogin(email, password) {
    const query = `
        SELECT * FROM CLIENTE 
        WHERE CLI_CORREO = ? AND CLI_CLAVE = ?
    `;
    const [rows] = await pool.query(query, [email, password]);
    return rows;
}

// Validar stock
async function validateStock(productosCarrito) {
    const errores = [];
    for (const producto of productosCarrito) {
        const query = 'SELECT PROD_STOCK FROM PRODUCTO WHERE PROD_NOMBRE = ?';
        const [rows] = await pool.query(query, [producto.nombre]);

        if (rows.length === 0) {
            errores.push({
                producto: producto.nombre,
                mensaje: 'Producto no encontrado en la base de datos',
            });
            continue;
        }

        const stockDisponible = rows[0].PROD_STOCK;
        if (producto.cantidad > stockDisponible) {
            errores.push({
                producto: producto.nombre,
                mensaje: `Solo quedan ${stockDisponible} unidades disponibles `,
            });
        }
    }
    return errores;
}

// Actualizar stock
async function updateStock(productosCarrito) {
    for (const producto of productosCarrito) {
        const query = 'UPDATE PRODUCTO SET PROD_STOCK = PROD_STOCK - ? WHERE PROD_NOMBRE = ?';
        await pool.query(query, [producto.cantidad, producto.nombre]);
    }
}

// Crear factura
async function createInvoice(clienteId, carrito, subtotal, iva) {
    const [rows] = await pool.query('SELECT MAX(FAC_ID) AS maxId FROM FACTURA');
    const maxIdNum = rows[0]?.maxId ? parseInt(rows[0].maxId.slice(1)) + 1 : 1;
    const nuevoId = `F${String(maxIdNum).padStart(3, '0')}`;
    const fechaHora = new Date();

    await pool.query(
        'INSERT INTO FACTURA (FAC_ID, CLI_ID, FAC_DESC, FAC_FECHAHORA, FAC_SUBTOTAL, FAC_IVA, FAC_ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)',
        `[nuevoId, clienteId, Factura de id: ${nuevoId}, fechaHora, subtotal, iva, 'CER']`
    );

    for (const producto of carrito) {
        const [productoRows] = await pool.query(
            'SELECT PROD_ID FROM PRODUCTO WHERE PROD_NOMBRE = ?',
            [producto.nombre]
        );
        if (!productoRows.length) throw new Error(`Producto no encontrado: ${producto.nombre}`);
        const prodId = productoRows[0].PROD_ID;

        await pool.query(
            'INSERT INTO PRO_FAC (FAC_ID, PROD_ID, PF_VALOR, PF_ESTADO) VALUES (?, ?, ?, ?)',
            [nuevoId, prodId, producto.precio, 'CER']
        );
    }
    return nuevoId;
}

// Obtener productos del menú
async function getMenuProducts() {
    const query = 'SELECT PROD_NOMBRE, PROD_PRECIO, PROD_DESC, PROD_IMG FROM PRODUCTO';
    const [rows] = await pool.query(query);
    return rows;
}

async function getMenuProductsOrdered() {
    const query = 'SELECT PROD_NOMBRE, PROD_PRECIO, PROD_DESCCORTA, PROD_IMG FROM PRODUCTO';
    const [rows] = await pool.query(query);
    return rows;
}

module.exports = {
    getNextClientId,
    insertClient,
    validateLogin,
    validateStock,
    updateStock,
    createInvoice,
    getMenuProducts,
    getMenuProductsOrdered,
};