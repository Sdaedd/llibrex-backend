const mongoose = require('mongoose');

const comentarioSchema = mongoose.Schema(
    {
        libro: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Libro',
            required: [true, "Por favor, especifique el libro al que pertenece el comentario."]
        },
        contenido: {
            type: String,
            required: [true, "Por favor, ingrese el contenido del comentario."]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comentario', comentarioSchema);
