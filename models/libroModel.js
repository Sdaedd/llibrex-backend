const mongoose = require("mongoose");

const libroSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
      required: [
        true,
        "Por favor, introduzca una ID de Google Books para el libro.",
      ],
    },
    title: {
      type: String,
      required: [true, "Por favor, introduzca un título para el libro."],
    },
    authors: {
      type: Array,
      required: [true, "Por favor, introduzca el autor del libro."],
    },
    description: {
      type: String,
      required: [true, "Por favor, introduzca una descripción del libro."],
    },
    image: {
      type: String,
      required: [true, "Por favor, introduzca una URL de imagen del libro."],
    },
    publicationDate: {
      type: Date,
      required: [
        true,
        "Por favor, introduzca la fecha de publicación del libro.",
      ],
    },
    epub: {
      type: String,
      required: [true, "Por favor, cargue el archivo EPUB."],
    },
    pageCount: {
      type: Number,
      required: [true, "Por favor, introduzca la cantidad de paginas."],
    },
    publisher: {
      type: String,
      required: [true, "Por favor, introduzca la editorial del libro."],
    },
    categories: {
      type: Array,
      required: [true, "Por favor, introduzca el género del libro."],
    },
    isbn: {
      type: String,
      required: [true, "Por favor, introduzca el ISBN del libro."],
    },
    rating: { type: Number, default: 0 },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comentario", default: [] },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Libro", libroSchema);
