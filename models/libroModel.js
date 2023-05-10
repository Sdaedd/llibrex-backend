const mongoose = require('mongoose');

const libroSchema = mongoose.Schema(
    {
        googleId: {
            type: String,
            required: [true, "Por favor, introduzca una ID de google books para el libro."]
        },
        title: {
            type: String,
            required: [true, "Por favor, introduzca un título para el libro."]
        },
        authors: {
            type: Array,
            required: [true, "Por favor, introduzca el autor del libro."]
        },
        description: {
            type: String,
            required: [true, "Por favor, introduzca una descripción del libro."]
        },
        image: {
            type: String,
            required: [true, "Por favor, introduzca una URL de imagen del libro."]
        },
        publicationDate: {
            type: Date,
            required: [true, "Por favor, introduzca la fecha de publicación del libro."]
        },
        blob: {
            type: Buffer,
            required: [true, "Por favor, cargue el archivo EPUB."]
        },
        actualPage: {
            type: Number,
            default: 0
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Libro', libroSchema);
