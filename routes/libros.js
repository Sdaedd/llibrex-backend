const express = require('express');
const router = express.Router();
const Usuario = require('../models/userModel.js');
const Libro = require('../models/libroModel.js');
const Comentario   = require('../models/comentarioModel.js');
const multer = require("multer");
const path = require('path')
const fs = require('fs');

/* 

  Upload libro

*/
// Configurar Multer para guardar los archivos .epub
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "libros/"); // Especifica la carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Puedes utilizar el nombre original del archivo o generar uno único
  },
});

const upload = multer({ storage: storage });

/* 

  GETS

*/

router.get('/leer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }

    const rutaArchivoEPUB = path.join(__dirname, '..', libro.epub); // Construye la ruta absoluta al archivo EPUB

    // Verificar si el archivo existe en el servidor
    if (fs.existsSync(rutaArchivoEPUB)) {
      const epubBuffer = fs.readFileSync(rutaArchivoEPUB); // Lee el archivo EPUB como un ArrayBuffer
      res.status(200).json({ epub: [...new Uint8Array(epubBuffer)] }); // Devuelve el ArrayBuffer como un array de bytes
    } else {
      res.status(404).json({ message: `No se puede encontrar el archivo EPUB del libro con la ID [${id}]` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Descargar un libro por su ID
router.get('/descargar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }

    const rutaArchivoEPUB = path.join(__dirname, '..', libro.epub); // Construye la ruta absoluta al archivo EPUB

    // Verificar si el archivo existe en el servidor
    if (fs.existsSync(rutaArchivoEPUB)) {
      res.download(rutaArchivoEPUB, libro.title + '.epub'); // Descarga el archivo EPUB con un nombre de archivo personalizado
    } else {
      res.status(404).json({ message: `No se puede encontrar el archivo EPUB del libro con la ID [${id}]` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna un JSON con todos los libros en la BBDD
router.get('/', async (req, res) => {
  try {
    if (req.query.isbn != undefined) {
    console.log(req.query.isbn)
    const isbnFilter = req.query.isbn; // Get the ISBN query parameter

    // Check if an ISBN is provided
    
      const libros = await Libro.find({
        isbn: isbnFilter
      });
      
      console.log(libros)

      if (libros.length < 0) {
        return res.status(404).json({ message: `No se puede encontrar ningún libro con el ISBN [${isbn}]` });
      }

      res.status(200).json(libros); // Return the book with the matching ISBN
    } else {
      // No ISBN provided, return all books
      const libros = await Libro.find({});
      res.status(200).json(libros);
    }
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

/* 

  POSTS

*/

// Crea un libro en la BBDD mediante un JSON enviado con POST
router.post("/", upload.single("epub"), async (req, res) => {
  try {
    const libroData = req.body;
    libroData.epub = req.file.path; // Asigna la ruta del archivo .epub al campo "epub" en el objeto libroData

    const libro = await Libro.create(libroData);
    res.status(200).json(libro);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Agregar un comentario a un libro
router.post('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = req.body;

    console.log(comentario)

    const libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }

    const comentarioGuardado = await Comentario.create(comentario); // Guarda el comentario en la base de datos y obtén el documento guardado

    libro.comments.push(comentarioGuardado._id); // Agrega la ID del comentario al arreglo comments
    const libroActualizado = await libro.save();

    res.status(200).json(libroActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const comentarios = libro.comments.map(comment => ({
      comment: comment,
    }));

    res.status(200).json(comentarios);
  } catch (error) {
    console.error('Error al obtener los libros en progreso del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

/* 

  PUTS

*/

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

/* 

  DELETES

*/

// Borrar un Libro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Borrar el libro de la colección de libros
    const libro = await Libro.findByIdAndDelete(id);
    if (!libro) {
      return res.status(404).json({ message: `No se puede encontrar ningún libro con la ID [${id}]` });
    }
    
    // Borrar el libro del campo progresoLibros de todos los usuarios
    await Usuario.updateMany(
      { "progresoLibros.libro": id },
      { $pull: { progresoLibros: { libro: id } } }
    );
    
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
