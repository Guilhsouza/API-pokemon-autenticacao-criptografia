const connection = require('../connectionPool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key = require('../secretKey')

const userRegister = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Estão faltando informações necessárias!' })
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const usuarioCadastrado = await connection.query(`
            insert into usuarios
            (nome, email, senha)
            values
            ($1, $2, $3)
        `, [nome, email, senhaCriptografada])

        return res.status(201).json({ mensagem: 'Usúario cadastrado com sucesso', usuario: { nome, email } })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ mensagem: err.message })
    }
}

const userLogin = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'email ou senha inválidos!' })
    }

    try {
        const usuario = await connection.query('select * from usuarios where email = $1', [email])

        const usuarioLogado = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!usuario.rowCount || !usuarioLogado) {
            return res.status(404).json({ mensagem: 'email ou senha inválidos!' })
        }

        const token = jwt.sign(
            { id: usuario.rows[0].id },
            key,
            { expiresIn: '2h' })

        const { senha: _, id: id, ...usuarioSemSenha } = usuario.rows[0]

        return res.json({ mensagem: 'usuario logado', usuario: usuarioSemSenha, token })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ mensagem: err.message })
    }
}

module.exports = {
    userRegister,
    userLogin
}