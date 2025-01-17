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
    database: "peteats",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000
});

const crypto = require('crypto');

app.post('/crear-cuenta', async (req, res) => {
    const { 
        nombreusuario, 
        email, 
        contrasena, 
        cli_cedula,
        cli_nombre, 
        cli_apellido, 
        cli_correo,
        cli_edad, 
        cli_celular,
    } = req.body;

    // Validación básica de datos recibidos
    if (!nombreusuario || !email || !contrasena || !cli_nombre || !cli_cedula || !cli_apellido || !cli_correo || !cli_edad || !cli_celular) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const client = await pool.connect();

        try {
            // Generar un ID único para el usuario
            let usuarioId;
            let idExistente;

            do {
                // Genera un string aleatorio de 10 caracteres
                usuarioId = crypto.randomBytes(4).toString('hex').slice(0, 7); // Tomar solo los primeros 7 caracteres
                
                // Verifica que el ID no exista ya en la tabla
                const idCheckResult = await client.query(
                    `SELECT COUNT(*) AS count FROM usuarios WHERE user_id = $1`,
                    [usuarioId]
                );
                idExistente = idCheckResult.rows[0].count > 0;
            } while (idExistente);

            // Iniciar transacción
            await client.query('BEGIN');

            // Insertar usuario en la tabla usuarios
            await client.query(
                `INSERT INTO usuarios (user_id, user_nombre_usuario, user_correo, user_contrasena,rol_id,user_estado) VALUES ($1, $2, $3, $4,$5,$6)`,
                [usuarioId, nombreusuario, email, contrasena, 1,'ACT']
            );

            // Insertar datos del cliente asociado a la tabla clientes
            await client.query(
                `INSERT INTO clientes (cli_cedula_ruc, id_usuario, cli_nombre, cli_apellido, cli_telefono, cli_correo, cli_estado) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [cli_cedula, usuarioId, cli_nombre, cli_apellido, cli_celular,cli_correo, 'ACT' ]
            );

            // Confirmar transacción
            await client.query('COMMIT');
            res.status(201).send({ message: 'Cuenta creada exitosamente', usuarioId });
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
                `SELECT * FROM usuarios WHERE user_nombre_usuario = $1 AND user_contrasena = $2`,
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
                `SELECT * FROM usuarios WHERE user_nombre_usuario = $1 AND user_contrasena = $2`,
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


app.get('/productosgatos', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM productos WHERE tipo_animal_id = $1`, [2]); // Asegúrate de que tienes una tabla productos
        res.status(200).json({ productos: result.rows });
        client.release();
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send({ message: 'Error al obtener los productos' });
    }
});
app.get('/productosperros', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM productos WHERE tipo_animal_id = $1`, [1]); // Asegúrate de que tienes una tabla productos
        res.status(200).json({ productos: result.rows });
        client.release();
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send({ message: 'Error al obtener los productos' });
    }
});
app.get('/productosaves', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM productos WHERE tipo_animal_id = $1`, [3]); // Asegúrate de que tienes una tabla productos
        res.status(200).json({ productos: result.rows });
        client.release();
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send({ message: 'Error al obtener los productos' });
    }
});
app.get('/productoshamsters', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM productos WHERE tipo_animal_id = $1`, [4]); // Asegúrate de que tienes una tabla productos
        res.status(200).json({ productos: result.rows });
        client.release();
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send({ message: 'Error al obtener los productos' });
    }
});

app.post('/crear-factura', async (req, res) => {
    const { cli_cedula_ruc, direccion, productos } = req.body;

    if (!cli_cedula_ruc || !productos || productos.length === 0 || !direccion) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios, incluyendo la dirección.' });
    }

    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); // Iniciar transacción

            // Paso 1: Insertar o reutilizar dirección
            let dirId;
            const direccionResult = await client.query(
                `SELECT dir_id FROM direcciones 
                 WHERE dir_provincia = $1 AND dir_ciudad = $2 AND dir_descripcion = $3 AND dir_cp = $4`,
                [direccion.provincia, direccion.ciudad, direccion.direccion, direccion.codigoPostal]
            );

            if (direccionResult.rows.length > 0) {
                dirId = direccionResult.rows[0].dir_id; // Dirección ya existe
            } else {
                const nuevaDireccion = await client.query(
                    `INSERT INTO direcciones (dir_provincia, dir_ciudad, dir_descripcion, dir_cp) 
                     VALUES ($1, $2, $3, $4) RETURNING dir_id`,
                    [direccion.provincia, direccion.ciudad, direccion.direccion, direccion.codigoPostal]
                );
                dirId = nuevaDireccion.rows[0].dir_id; // Nueva dirección creada
            }

            // Paso 2: Asociar dirección con el cliente en la tabla cliente_direccion
            const clienteDireccionResult = await client.query(
                `SELECT * FROM cliente_direccion WHERE cli_cedula = $1 AND dir_id = $2`,
                [cli_cedula_ruc, dirId]
            );

            if (clienteDireccionResult.rows.length === 0) {
                await client.query(
                    `INSERT INTO cliente_direccion (cli_cedula, dir_id) VALUES ($1, $2)`,
                    [cli_cedula_ruc, dirId]
                );
            }

            // Paso 3: Crear factura
            const facturaMaxResult = await client.query(
                `SELECT COALESCE(MAX(fac_numero), 0) + 1 AS nuevo_numero FROM factura`
            );
            const nuevoFacNumero = facturaMaxResult.rows[0].nuevo_numero;

            const fechaActual = new Date();
            let subtotal = 0;

            // Calcular el subtotal
            productos.forEach(producto => {
                subtotal += producto.cantidad * producto.precio;
            });

            const iva = subtotal * 0.15; // IVA del 15%
            const total = subtotal + iva;

            await client.query(
                `INSERT INTO factura (fac_numero, cli_cedula_ruc, fac_fecha, fac_subtotal, fac_total_iva, fac_total, fac_estado) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [nuevoFacNumero, cli_cedula_ruc, fechaActual, subtotal, iva, total, 'ACT']
            );

            // Paso 4: Insertar detalles de factura y actualizar stock
            for (const producto of productos) {
                await client.query(
                    `INSERT INTO detalle_factura (fac_numero, prd_id, df_cantidad, df_precio) 
                     VALUES ($1, $2, $3, $4)`,
                    [nuevoFacNumero, producto.prd_id, producto.cantidad, producto.precio]
                );

                const stockResult = await client.query(
                    `SELECT prd_stock FROM productos WHERE prd_id = $1`,
                    [producto.prd_id]
                );

                const stockActual = stockResult.rows[0]?.prd_stock || 0;
                const nuevoStock = stockActual - producto.cantidad;

                if (nuevoStock < 0) {
                    throw new Error(`Stock insuficiente para el producto con ID ${producto.prd_id}`);
                }

                await client.query(
                    `UPDATE productos SET prd_stock = $1 WHERE prd_id = $2`,
                    [nuevoStock, producto.prd_id]
                );
            }

            await client.query('COMMIT'); // Confirmar transacción

            res.status(201).send({
                message: 'Factura creada con éxito y stock actualizado',
                factura: {
                    fac_numero: nuevoFacNumero,
                    cli_cedula_ruc,
                    fac_fecha: fechaActual,
                    fac_subtotal: subtotal,
                    fac_total_iva: iva,
                    fac_total: total,
                    direccion,
                    productos
                }
            });
        } catch (error) {
            await client.query('ROLLBACK'); // Revertir transacción en caso de error
            console.error('Error al crear la factura:', error);
            res.status(500).send({ message: 'Error al crear la factura', error: error.message });
        } finally {
            client.release(); // Liberar la conexión
        }
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
        res.status(500).send({ message: 'Error en la conexión con la base de datos', error: err.message });
    }
});






// Iniciar el servidor
app.listen(PORT,host, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});