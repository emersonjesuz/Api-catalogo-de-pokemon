const express = require("express");
const {
  registerPokemon,
  updatePokemon,
  listPokemons,
  showPokemon,
  deletePokemon,
} = require("../controllers/pokemon.controllers");
const {
  registerUser,
  loginUser,
  showProfile,
} = require("../controllers/user.controllers");
const checkingAuthorization = require("../middleware/middleware");

const router = express();

router.post("/cadastrar", registerUser);
router.post("/login", loginUser);

router.use(checkingAuthorization);

router.get("perfil", showProfile);

router.post("/pokemon/cadastrar", registerPokemon);
router.put("/pokemon/atualizar/:id", updatePokemon);
router.get("/pokemon/lista", listPokemons);
router.get("/pokemon/lista/:id", showPokemon);
router.delete("/pokemon/delete/:id", deletePokemon);

module.exports = router;
