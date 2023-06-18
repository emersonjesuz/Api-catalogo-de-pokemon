const bcrypt = require("bcrypt");
const pool = require("../connect/connect");
const jwt = require("jsonwebtoken");
const passwordJwt = require("../passwordJwt/passwordJwt");

async function registerUser(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ message: "preencha todos os campos" });

  try {
    const passwordCryptography = await bcrypt.hash(senha, 10);

    const query = `insert into usuarios (nome, email, senha)
    values ($1, $2, $3) `;

    await pool.query(query, [nome, email, passwordCryptography]);

    return res.json("usuario criado com sucesso");
  } catch (error) {
    if (error.constraint === "usuarios_email_key")
      return res.status(500).json({ message: "usuario  ja existe !" });
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

async function loginUser(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ message: "preencha todos os campos!" });

  try {
    const user = await pool.query(`select * from usuarios where email = $1 `, [
      email,
    ]);

    if (user.rowCount < 1)
      return res.status(400).json({ message: "email ou senha invalido!" });

    const chekedingPassword = await bcrypt.compare(senha, user.rows[0].senha);

    if (!chekedingPassword)
      return res.status(400).json({ message: "email ou senha invalido!" });

    const token = jwt.sign({ id: user.rows[0].id }, passwordJwt, {
      expiresIn: "8h",
    });

    const { senha: _, ...userLog } = user.rows[0];

    res.json({ usuario: userLog, token });
  } catch (error) {
    return res.status(400).json({ message: "Erro interno do servidor" });
  }
}

function showProfile(req, res) {
  return res.json(req.usuario);
}

module.exports = {
  registerUser,
  loginUser,
  showProfile,
};
