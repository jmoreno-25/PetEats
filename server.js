//server.js
// Programación js del lado del servidor
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

app.post('/crear-cuenta', async (req, res) => {
    const { 
        nombreusuario, 
        email, 
        contrasena, 
        cli_nombre, 
        cli_apellido, 
        cli_correo,
        cli_edad, 
        cli_celular 
    } = req.body;

    // Validación básica de datos recibidos
    if (!nombreusuario || !email || !contrasena ||!cli_nombre || !cli_apellido || !cli_correo|| !cli_edad || !cli_celular) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const client = await pool.connect();

        try {
            // Iniciar transacción
            await client.query('BEGIN');

            // Insertar usuario en la tabla usuarios
            const usuarioResult = await client.query(
                `INSERT INTO usuarios (nombreusuario, email, contrasena) VALUES ($1, $2, $3) RETURNING id`,
                [nombreusuario, email, contrasena]
            );

            const usuarioId = usuarioResult.rows[0].id;

            // Insertar datos del cliente asociado a la tabla clientes
            await client.query(
                `INSERT INTO clientes (usuario_id,cli_nombre, cli_apellido,cli_correo, cli_edad, cli_celular) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [usuarioId, cli_nombre, cli_apellido,cli_correo,cli_edad, cli_celular]
            );

            // Confirmar transacción
            await client.query('COMMIT');
            res.status(201).send({ message: 'Cuenta creada exitosamente',usuarioId });
            
        } catch (err) {
            // Revertir transacción si ocurre un error
            await client.query('ROLLBACK');
            console.error('Error durante la transacción:', err);
            res.status(500).send({ message: 'Error al crear cuenta', error: err.message });
        } finally {
            client.release(); // Liberar conexión
        }
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
        res.status(500).send({ message: 'Error en la conexión con la base de datos', error: err.message });
    }
});

app.post('/datos-envio', async (req, res) => {
    const { usuario_id, provincia, ciudad, direccion, codigopostal} = req.body;

    if (!usuario_id || !provincia || !ciudad || !direccion || !codigopostal) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                `INSERT INTO direcciones (usuario_id, provincia, ciudad, dirección, codigo_postal) 
                VALUES ($1, $2, $3, $4, $5)`,
                [usuario_id, provincia, ciudad, direccion, codigopostal]
            );

            await client.query('COMMIT');
            res.status(201).send({ message: 'Datos de envío guardados exitosamente' });
        } catch (err) {
            await client.query('ROLLBACK');
            res.status(500).send({ message: 'Error al guardar datos de envío', error: err.message });
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(500).send({ message: 'Error en la conexión con la base de datos', error: err.message });
    }
});

app.post('/verificar-usuario', async (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validación básica
    if (!usuario || !contrasena) {
        return res.status(400).send({ message: 'El correo y la contraseña son obligatorios' });
    }

    try {
        const client = await pool.connect();
        try {
            // Verificar si el usuario existe en la base de datos
            const result = await client.query(
                `SELECT * FROM usuarios WHERE nombreusuario = $1 AND contrasena = $2`,
                [usuario, contrasena]
            );

            if (result.rows.length > 0) {
                res.status(200).send({ 
                    message: 'Bienvenido', 
                    isLoggedIn: true, 
                    usuario: result.rows[0] 
                });
            } else {
                res.status(404).send({ message: 'Usuario no encontrado' });
                isLoggedIn: false 
            }
        } finally {
            client.release(); // Liberar la conexión
        }
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send({ message: 'Error en la conexión con la base de datos', error: err.message });
    }
});

app.post('/iniciar-sesion', async (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validación básica
    if (!usuario || !contrasena) {
        return res.status(400).send({ message: 'El correo y la contraseña son obligatorios' });
    }

    try {
        const client = await pool.connect();
        try {
            // Verificar si el usuario existe en la base de datos
            const result = await client.query(
                `SELECT * FROM usuarios WHERE nombreusuario = $1 AND contrasena = $2`,
                [usuario, contrasena]
            );

            if (result.rows.length > 0) {
                res.status(200).send({ 
                    message: 'Bienvenido', 
                    isLoggedIn: true, 
                    usuario: result.rows[0] 
                });
            } else {
                res.status(404).send({ message: 'Usuario no encontrado' });
                isLoggedIn: false 
            }
        } finally {
            client.release(); // Liberar la conexión
        }
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send({ message: 'Error en la conexión con la base de datos', error: err.message });
    }
});


// Iniciar el servidor
app.listen(PORT,host, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});