const jwt = require("jsonwebtoken");
const pool = require("../connect/connect");
const passwordJwt = require("../passwordJwt/passwordJwt");

async function checkingAuthorization(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ messege: "Não altorizado 1!" });

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, passwordJwt);

    const { rows, rowCount } = await pool.query(
      `select * from usuarios where id = $1`,
      [id]
    );

    if (rowCount < 1)
      return res.status(401).json({ messege: "Não altorizado!2" });

    req.usuario = rows[0];

    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).json(error);
  }
}

module.exports = checkingAuthorization;
