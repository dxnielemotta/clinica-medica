import User from "../models/User.js";

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
