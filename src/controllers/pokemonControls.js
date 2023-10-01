const connection = require('../connectionPool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key = require('../secretKey')

const cadastrarPokemon = async (req, res) => {
    let { nome, habilidades, imagem, apelido } = req.body

    if (!nome || !habilidades) {
        return res.status(400).json({ mensagem: 'estão faltando informações necessarias (nome, habilidade)' })
    }

    const habilidadesEmArray = habilidades.split(', ')

    if (!apelido) {
        apelido = nome
    }

    const pokemonCadastrado = {
        treinador: req.usuario.nome,
        nome,
        apelido,
        habilidades: habilidadesEmArray
    }

    const query = `
    insert into pokemons
    (usuario_id, nome, habilidades, imagem, apelido)
    values
    ($1, $2, $3, $4, $5)`

    const params = [req.usuario.id, nome, habilidadesEmArray, imagem, apelido]

    const cadastrandoPokemon = await connection.query(query, params)

    return res.status(201).json({ mensagem: 'Pokemon cadastrado com sucesso!', pokemonCadastrado })
}

const apelidarPokemon = async (req, res) => {
    const { idPokemon, apelido } = req.body

    if (!idPokemon || !apelido) {
        return res.status(400).json({ mensagem: 'estão faltando informações necessarias!' })
    }

    const verificarTreinadorPokemon = await connection.query('select * from pokemons where id = $1 and usuario_id = $2', [idPokemon, req.usuario.id])

    if (!verificarTreinadorPokemon.rowCount) {
        return res.status(404).json({ mensagem: `este pokemon não foi encontrado no inventário de ${req.usuario.nome}` })
    }

    const query = `
    update pokemons
    set apelido = $1
    where id = $2 and usuario_id = $3`
    const params = [apelido, idPokemon, req.usuario.id]

    const modificandoApelido = await connection.query(query, params)

    return res.status(200).json({ mensagem: `O pokemon ${verificarTreinadorPokemon.rows[0].nome} agora tem o apelido de ${apelido}` })
}

const listagemCompletaPokemons = async (req, res) => {
    return res.status(200).json((await connection.query('select * from pokemons')).rows)
}

const listarPokemonsPorID = async (req, res) => {
    const { id } = req.params

    const pokemon = await connection.query('select * from pokemons where id = $1', [id])

    if (!pokemon.rowCount) {
        return res.status(404).json({ mensagem: `O pokemon com id ${id} não existe no banco de dados!` })
    }

    return res.json(pokemon.rows[0])
}

const excluirPokemon = async (req, res) => {
    const { id } = req.params

    const pokemonExiste = await connection.query('select * from pokemons where id = $1', [id])

    if (!pokemonExiste.rowCount) {
        return res.status(404).json({ mensagem: `pokemon com id ${id} não existe` })
    }

    const query = `
    delete from pokemons
    where id = $1
    `
    const params = [id]

    const deletandoPokemon = await connection.query(query, params)

    return res.json({ mensagem: `pokemon ${pokemonExiste.rows[0].apelido} do ${req.usuario.nome} descartado da lista de pokemons :(` })
}

module.exports = {
    cadastrarPokemon,
    apelidarPokemon,
    listagemCompletaPokemons,
    listarPokemonsPorID,
    excluirPokemon
}