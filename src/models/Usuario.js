import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, // 👈 guarda siempre en minúsculas
      trim: true       // 👈 elimina espacios extra
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6     // 👈 opcional: mínimo de seguridad
    },
  },
  { timestamps: true } // 👈 añade createdAt / updatedAt
);

export const Usuario = mongoose.model("Usuario", usuarioSchema);
