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

// Crea un SUBcomentario en la BBDD mediante un JSON enviado con POST
router.post('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;
    const comentarioPadre = await Comentario.findById(id);
    if (!comentarioPadre) {
      return res.status(404).json({ message: `No se puede encontrar ningún comentario con la ID [${id}]` });
    }

    const subcomentario = {
      contenido: req.body.contenido,
      valoracion: req.body.valoracion,
      fechaPublicacion: new Date().toISOString(),
      usuario: req.body.usuario,
      libro: req.body.libro,
      comentarioPadre: id,
    };

    const comentarioCreado = await Comentario.create(subcomentario);
    comentarioPadre.comentariosHijos.push(comentarioCreado._id);
    await comentarioPadre.save();

    res.status(200).json(comentarioCreado);
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

// Ruta para agregar o eliminar un like a un comentario específico
router.put('/:id/like/:userId', async (req, res) => {
  try {
    const comment = await Comentario.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    const userId = req.params.userId;
    const likes = comment.likes.map((like) => like._id.toString());
    // Verificar si el usuario ya ha dado like
    const userLiked = likes.includes(userId);
    
    if (userLiked) {
      // El usuario ya ha dado like, se elimina el like
      comment.likes.pull(userId);
    } else {
      // El usuario no ha dado like, se agrega el like
      comment.likes.push(userId);
    }

    // Guardar el comentario actualizado
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud' });
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