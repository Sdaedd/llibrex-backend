const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://edgoluc:mixeer123@llibrex.742lzwi.mongodb.net/Llibrex?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };
