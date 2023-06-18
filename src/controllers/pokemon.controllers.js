const pool = require("../connect/connect");

async function registerPokemon(req, res) {
  const { nome, habilidades, imagem, apelido } = req.body;
  const { usuario } = req;

  if (!nome || !habilidades)
    return res
      .status(400)
      .json({ meseege: "nome e habilidades precisam ser preenchidos" });

  try {
    const query = `insert into pokemons (usuario_id, nome, habilidades, imagem, apelido) 
        values ( $1, $2, $3, $4, $5)`;
    await pool.query(query, [usuario.id, nome, habilidades, imagem, apelido]);

    res.json({ message: "Pokemon catalogado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
}

async function updatePokemon(req, res) {
  const { id } = req.params;
  const { apelido } = req.body;

  if (!id) return res.status(404).json({ message: "Pokemon nâo encontrado" });
  try {
    const { rowCount } = await pool.query(
      "select * from pokemons where id = $1",
      [id]
    );

    if (rowCount < 1)
      return res.status(404).json({ message: "Pokemon nâo encontrado" });

    await pool.query("update pokemons set apelido = $1 where id = $2", [
      apelido,
      id,
    ]);
    res.json({ message: "Apelido do pokemon atualizado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
}

async function listPokemons(req, res) {
  const idUser = req.usuario.id;

  try {
    const { rowCount, rows } = await pool.query(
      "select * from pokemons where usuario_id =  $1",
      [idUser]
    );
    if (rowCount < 1) return res.json("Nenhum pokemon catalogado!");
    const list = [];
    for (let item of rows) {
      list.push({
        ...item,
        habilidades: item.habilidades.split(","),
      });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
}
async function showPokemon(req, res) {
  const idUser = req.usuario.id;
  const { id } = req.params;

  if (!id) return res.json("Nenhum pokemon encontrado!");
  try {
    const { rowCount, rows } = await pool.query(
      "select * from pokemons where usuario_id = $1 and id = $2",
      [idUser, id]
    );
    if (rowCount < 1) return res.json("Nenhum pokemon encontrado!");
    const pokemon = { ...rows[0], habilidades: rows[0].habilidades.split(",") };

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
}

async function deletePokemon(req, res) {
  const { id } = req.params;

  if (!id) return res.status(404).json({ message: "Pokemon nâo encontrado" });
  try {
    const { rowCount } = await pool.query(
      "select * from pokemons where id = $1",
      [id]
    );

    if (rowCount < 1)
      return res.status(404).json({ message: "Pokemon nâo encontrado" });

    await pool.query("delete from  pokemons  where id = $1", [id]);
    res.json({ message: "pokemon excluido!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
}

module.exports = {
  registerPokemon,
  updatePokemon,
  listPokemons,
  showPokemon,
  deletePokemon,
};
