const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const archivoEventos = './eventos.json';

//GET
app.get('/eventos', (req, res) => {
  fs.readFile(archivoEventos, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudieron cargar los eventos' });

    const eventos = JSON.parse(data);
    res.json(eventos);
  });
});

//POST
app.post('/eventos', (req, res) => {
  const { nombre, fecha, hora } = req.body;

  if (!nombre || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  fs.readFile(archivoEventos, 'utf8', (err, data) => {
    let eventos = [];
    if (!err && data) eventos = JSON.parse(data);

    eventos.push({ nombre, fecha, hora });

    if (eventos.length > 3) eventos = eventos.slice(-3);

    fs.writeFile(archivoEventos, JSON.stringify(eventos, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al guardar el evento' });
      res.json({ mensaje: 'Evento guardado correctamente' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
