const express = require('express');
const cors = require('cors');
const librosRouter = require('./routes/libros.js');
const { connectDB } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello LLIBREX API');
});

app.get('/blog', (req, res) => {
  res.send('Hello blog ke lo ke');
});

app.use('/libros', librosRouter);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Llibrex API app is running on port 3000');
  });
});
