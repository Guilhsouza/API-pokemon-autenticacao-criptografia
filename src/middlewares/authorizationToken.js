const connection = require('../connectionPool')
const jwt = require('jsonwebtoken')
const key = require('../secretKey')

const autorizarComToken = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'não autorizado!' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, key)

        const usuarioCompleto = await connection.query('select * from usuarios where id = $1', [id])

        if (!usuarioCompleto.rowCount) {
            return res.status(404).json({ mensagem: 'usúario logado não encontrado!' })
        }

        const { senha: _, ...usuarioNecessario } = usuarioCompleto

        req.usuario = usuarioNecessario.rows[0]

        next()
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ mensagem: 'Erro interno no servidor!' })
    }

}

module.exports = {
    autorizarComToken
}
