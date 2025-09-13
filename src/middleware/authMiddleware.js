import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const { authorization } = req.headers;

  // verifica se o token foi enviado
  if (!authorization) {
    return res.status(401).json({ error: "Nenhum token fornecido." });
  }

  const token = authorization.split(" ")[1];
  const jwtPassword = process.env.JWT_SECRET;

  jwt.verify(token, jwtPassword, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }

    // se o token for válido, anexa o ID e o role do usuário à requisição
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // continua para a próxima etapa (o controller da rota)
    return next();
  });
};
