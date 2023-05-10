const express = require('express');
const cors = require('cors');
const librosRouter = require('./routes/libros.js');
const usuariosRouter = require('./routes/usuarios.js');
const comentariosRouter = require('./routes/comentarios.js');
const { connectDB } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello LLIBREX API');
});

app.use('/libros', librosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/comentarios', comentariosRouter);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Llibrex API app is running on port 3000');
  });
});
