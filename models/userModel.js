const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = mongoose.Schema(
  {
    acceso: {
      type: String,
      default: "usuario" // Ejemplo: admin, moderador, usuario
    },
    nombre: {
      type: String,
      required: [true, "Por favor, introduzca el nombre del usuario."]
    },
    contraseña: {
      type: String,
      required: [true, "Por favor, introduzca la contraseña del usuario."]
    },
    progresoLibros: [
      {
        libro: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Libro',
          required: true
        },
        capituloActual: {
          type: Number,
          default: 0 // Capítulo por defecto cuando no se ha leído ningún capítulo aún
        },
        epubCfi: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);

/* // Antes de guardar el usuario, se realiza el hash de la contraseña mediante bcryptjs
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Antes de actualizar el usuario, se realiza el hash de la contraseña mediante bcryptjs
usuarioSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.contraseña) {
    try {
      const salt = await bcrypt.genSalt(10);
      this._update.contraseña = await bcrypt.hash(this._update.contraseña, salt);
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

// Método para comparar la contraseña ingresada con la contraseña almacenada
usuarioSchema.methods.comparePassword = async function (contraseña) {
  console.log(this.contraseña)
  bcrypt.compare(contraseña, this.contraseña);
}; */

module.exports = mongoose.model('Usuario', usuarioSchema);
