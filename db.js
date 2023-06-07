const mongoose = require('mongoose');

const mongoURL = "mongodb+srv://edgoluc:mixeer123@llibrex.742lzwi.mongodb.net/Llibrex?retryWrites=true&w=majority";

async function connectDB() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };