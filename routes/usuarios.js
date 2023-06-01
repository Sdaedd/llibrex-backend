const express = require('express');
const router = express.Router();
const Usuario = require('../models/userModel.js');
const Libro = require('../models/libroModel.js');
const fs = require('fs');

/* 

  GETS

*/

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

/* 

  POSTS

*/

// Crea un usuario en la BBDD mediante un JSON enviado con POST
router.post('/', async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;

    // Antes de guardar se encripta la contraseña en el modelo.
    const usuario = await Usuario.create({
      nombre: nombre,
      contraseña: contraseña
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Agrega un libro al array progresoLibros de un usuario
router.post('/:id/libros', async (req, res) => {
  try {
    const { id } = req.params;
    const { libro, capituloActual } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: `No se puede encontrar ningún usuario con la ID [${id}]` });
    }

    // Crea un objeto con los datos del libro y el capítulo actual
    const nuevoProgresoLibro = {
      libro: libro,
      capituloActual: capituloActual || 0 // Capítulo por defecto cuando no se ha leído ningún capítulo aún
    };

    // Agrega el libro al array progresoLibros del usuario
    usuario.progresoLibros.push(nuevoProgresoLibro);

    // Guarda los cambios en la base de datos
    await usuario.save();

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

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;
    const usuario = await Usuario.findOne({ nombre });
    
    if (!usuario) {
      return res.status(401).json({ message: 'El nombre no es válido' });
    }
/*     console.log(usuario)
    const contraseñaValida = await usuario.comparePassword(contraseña); */

    if (usuario.contraseña != contraseña) {
      return res.status(401).json({ message: 'La contraseña no es válida: ['+contraseña+']' });
    }

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso',
      userId: usuario.id, 
      userRole: usuario.acceso 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna los libros con progreso de un usuario en formato JSON
router.get('/:id/libros', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const progresoLibros = usuario.progresoLibros.map(libro => ({
      libro: libro.libro,
      capituloActual: libro.capituloActual,
      fechaUltimaLectura: libro.fechaUltimaLectura
    }));

    res.status(200).json(progresoLibros);
  } catch (error) {
    console.error('Error al obtener los libros en progreso del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para guardar un libro en el usuario
router.post('/:userId/libros', async (req, res) => {
  try {
    const { userId } = req.params;
    const { libro, capituloActual } = req.body;

    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.progresoLibros.push({ libro, capituloActual });
    await usuario.save();

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al guardar el libro en progresoLibros del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para guardar el progreso de un libro en el usuario
router.put('/:userId/libros/:libroId', async (req, res) => {
  try {
    const { userId, libroId } = req.params;
    const { capituloActual, epubCfi } = req.body;

    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const progresoLibro = usuario.progresoLibros.find((progreso) => progreso.libro.toString() === libroId);
    if (!progresoLibro) {
      // Si el libro no existe en el progresoLibros, lo agregamos
      usuario.progresoLibros.push({ libro: libroId, capituloActual, epubCfi, fechaUltimaLectura: new Date() });
    } else {
      // Si el libro ya existe en el progresoLibros, actualizamos el capituloActual, epubCfi y fechaUltimaLectura
      progresoLibro.capituloActual = capituloActual;
      progresoLibro.epubCfi = epubCfi;
      progresoLibro.fechaUltimaLectura = new Date();
      console.log(progresoLibro.fechaUltimaLectura)
    }
    
    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al guardar el progreso del libro en el usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Borrar un libro del array progresoLibros de un usuario
router.delete('/:userId/libros/:libroId', async (req, res) => {
  try {
    const { userId, libroId } = req.params;

    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const progresoLibros = usuario.progresoLibros;

    // Encuentra el índice del libro en el array progresoLibros
    const libroIndex = progresoLibros.findIndex(libro => libro.libro.toString() === libroId);
    if (libroIndex === -1) {
      return res.status(404).json({ message: 'Libro no encontrado en el progreso del usuario' });
    }

    // Elimina el libro del array progresoLibros
    progresoLibros.splice(libroIndex, 1);

    // Guarda los cambios en la base de datos
    await usuario.save();

    res.status(200).json({ message: 'Libro borrado exitosamente' });
  } catch (error) {
    console.error('Error al borrar el libro del progreso del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;