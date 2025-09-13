import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["patient", "secretary"], default: "patient" },
  address: {
    cep: String,
    street: String,
    city: String,
    state: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// middleware do Mongoose que é executado ANTES de um usuário ser salvo
UserSchema.pre("save", async function (next) {
  // se a senha não foi modificada, não faz nada -> evita que a senha seja criptografada novamente
  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
