const { Router } = require('express')
const usersControls = require('./controllers/usersControls')
const pokemonControls = require('./controllers/pokemonControls')
const authorization = require('./middlewares/authorizationToken')

const router = Router()

router.post('/cadastro', usersControls.userRegister)
router.post('/login', usersControls.userLogin)

router.use(authorization.autorizarComToken)

router.post('/cadastrarPokemon', pokemonControls.cadastrarPokemon)
router.patch('/editarApelido', pokemonControls.apelidarPokemon)
router.get('/listarPokemons', pokemonControls.listagemCompletaPokemons)
router.get('/listarPokemons/:id', pokemonControls.listarPokemonsPorID)
router.delete('/excluirPokemon/:id', pokemonControls.excluirPokemon)

module.exports = router