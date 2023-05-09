const express = require("express");
const mongoose = require("mongoose");
const Libro = require("./models/libroModel");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

/* 
        ROUTES
*/
app.get("/", (req, res) => {
  res.send("Hello LLIBREX API");
});

app.get("/blog", (req, res) => {
  res.send("Hello blog ke lo ke");
});

// Retorna un JSON con todos los libros en la BBDD
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find({});
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retorna un JSON con el libro que coincida con la ID.
app.get("/libro/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const libro = await Libro.findById(id);
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un libro en la BBDD mediante un JSON enviado con POST
app.post("/libro", async (req, res) => {
  try {
    const libro = await Libro.create(req.body);
    res.status(200).json(libro);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Actualiza el Libro que coincida con la ID en la BBDD.
app.put('/libro/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const libro = await Libro.findByIdAndUpdate(id, req.body);
        if(!libro) {
            return res.status(404).json({message: `No se puede encontrar ningun libro con la ID [ ${id} ]`})
        }
        const libroUpdated = await Libro.findById(id);
        res.status(200).json(libroUpdated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Borrar un Libro

app.delete('/libro/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const libro = await Libro.findByIdAndDelete(id);
        if(!libro) {
            return res.status(404).json({message: `No se puede encontrar ningun libro con la ID ['${id}']`})
        }
        res.status(200).json(libro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
/* 

    Conexión a la BBDD. 
    En caso de ser exitoso, lanza la API en el puerto [3000]

*/
mongoose.connect(
    "mongodb+srv://edgoluc:mixeer123@llibrex.742lzwi.mongodb.net/Llibrex?retryWrites=true&w=majority" , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
  
    )
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(3000, () => {
      console.log("Llibrex API app is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });