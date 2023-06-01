const mongoose = require("mongoose");

const comentarioSchema = mongoose.Schema(
  {
    libro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Libro",
      required: [
        true,
        "Por favor, especifique el libro al que pertenece el comentario.",
      ],
    },
    usuario: {
      type: String,
      required: [
        true,
        "Por favor, especifique el usuario que ha hecho el comentario.",
      ],
    },
    contenido: {
      type: String,
      required: [true, "Por favor, ingrese el contenido del comentario."],
    },
    likes: [
      {
        usuario: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuario",
        },
      },
    ],
    valoracion: {
      type: Number,
      required: [true, "Por favor, ingrese la valoración del comentario."],
      min: 0,
      max: 5,
    },
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
    comentariosHijos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comentario",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comentario", comentarioSchema);
