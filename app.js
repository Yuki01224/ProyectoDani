const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Configuración de EJS y middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'cine'
});

// Rutas principales
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/comprar', (req, res) => {
    const { sala, pelicula, horario, fecha } = req.body;
    
    db.query(
        'INSERT INTO tickets (sala, pelicula, horario, fecha) VALUES (?, ?, ?, ?)',
        [sala, pelicula, horario, fecha],
        (err, result) => {
            if(err) throw err;
            res.redirect(`/ticket/${result.insertId}`);
        }
    );
});

app.get('/ticket/:id', (req, res) => {
    db.query(
        'SELECT * FROM tickets WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if(err) throw err;
            res.render('ticket', { ticket: results[0] });
        }
    );
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.post('/admin/ventas', (req, res) => {
    const { fecha } = req.body;
    
    db.query(
        'SELECT * FROM tickets WHERE fecha = ?',
        [fecha],
        (err, tickets) => {
            if(err) throw err;
            
            db.query(
                'SELECT SUM(precio * cantidad) AS total_comida FROM ventas_comida WHERE ticket_id IN (SELECT id FROM tickets WHERE fecha = ?)',
                [fecha],
                (err, comidaResult) => {
                    if(err) throw err;
                    
                    res.render('admin', {
                        fecha,
                        tickets,
                        totalComida: comidaResult[0].total_comida || 0
                    });
                }
            );
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});