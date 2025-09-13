import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const user = await User.create(req.body);

    // remove a senha da resposta para não expor
    user.password = undefined;

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ error: "Falha no registro.", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // busca o usuário pelo email (e inclui a senha na busca)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // usa bcrypt.compare() para verificar se a senha está correta
    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      return res.status(400).json({ error: "Senha inválida." });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    // remove a senha da resposta
    user.password = undefined;

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: "Falha no login.", details: error.message });
  }
};
