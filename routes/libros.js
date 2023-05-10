const express = require('express');
const router = express.Router();
const Libro = require('../models/libroModel.js');

// Retorna un JSON con todos los libros en la BBDD
router.get('/', async (req, res) => {
  try {
    const libros = await Libro.find({});
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna un JSON con el libro que coincida con la ID.
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un libro en la BBDD mediante un JSON enviado con POST
router.post('/', async (req, res) => {
  try {
    const libro = await Libro.create(req.body);
    res.status(200).json(libro);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Actualiza el Libro que coincida con la ID en la BBDD.
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByIdAndUpdate(id, req.body);
    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }
    const libroUpdated = await Libro.findById(id);
    res.status(200).json(libroUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrar un Libro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByIdAndDelete(id);
    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
