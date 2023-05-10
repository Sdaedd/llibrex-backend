const express = require('express');
const router = express.Router();
const Comentario = require('../models/comentarioModel.js');

// Retorna un JSON con todos los comentarios en la BBDD
router.get('/', async (req, res) => {
  try {
    const comentarios = await Comentario.find({});
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna un JSON con el comentario que coincida con la ID.
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findById(id);
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un comentario en la BBDD mediante un JSON enviado con POST
router.post('/', async (req, res) => {
  try {
    const comentario = await Comentario.create(req.body);
    res.status(200).json(comentario);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Actualiza el comentario que coincida con la ID en la BBDD.
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByIdAndUpdate(id, req.body);
    if (!comentario) {
      return res.status(404).json({ message: `No se puede encontrar ningún comentario con la ID [${id}]` });
    }
    const comentarioActualizado = await Comentario.findById(id);
    res.status(200).json(comentarioActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrar un comentario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByIdAndDelete(id);
    if (!comentario) {
      return res.status(404).json({ message: `No se puede encontrar ningún comentario con la ID [${id}]` });
    }
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;