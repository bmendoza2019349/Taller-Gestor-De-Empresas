import mongoose from 'mongoose';

// Definir el esquema para el modelo de usuario
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  phone: {
    type: String,
    minLength: 8,
    maxLength: 8,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMINISTRATOR"],
  },
  estado: {
    type: Boolean,
    default: true,
  }
});

// Modificar el método toJSON para excluir campos no deseados en la respuesta
UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

// Exportar el modelo de usuario
export default mongoose.model('User', UserSchema);
