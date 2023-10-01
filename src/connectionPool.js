const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '24082003',
    database: 'catalogo_pokemon',
})

module.exports = pool