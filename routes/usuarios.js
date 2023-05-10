const express = require('express');
const router = express.Router();
const Usuario = require('../models/userModel.js');
const Libro = require('../models/libroModel.js');

// Retorna un JSON con todos los usuarios en la BBDD
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna un JSON con el usuario que coincida con la ID.
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un usuario en la BBDD mediante un JSON enviado con POST
router.post('/', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Actualiza el usuario que coincida con la ID en la BBDD.
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, req.body);
    if (!usuario) {
      return res.status(404).json({ message: `No se puede encontrar ningún usuario con la ID [${id}]` });
    }
    const usuarioActualizado = await Usuario.findById(id);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ message: `No se puede encontrar ningún usuario con la ID [${id}]` });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;