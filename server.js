const express = require('express');
const app = express();

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');

// Ruta para renderizar una vista
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Mi página EJS', 
        mensaje: '¡Hola desde EJS!' 
    });
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});