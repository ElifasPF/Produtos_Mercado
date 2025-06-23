const fastify = require('fastify')();
const mysql = require('mysql2');
const cors = require('@fastify/cors')

fastify.register(cors)

async function conectar() {
    const conexao = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'MercadoDescontao',
        port: 3306
    })
    return conexao
}
fastify.get('/produtos', async (request, reply) => {
    try {
        const conn = await conectar();
        const [produtos] = await conn.query('SELECT * FROM produtos')
        reply.send(produtos)
    } catch (erro) {
        console.log(erro)
        reply.status(500).send({mensagem: 'Erro ao buscar produtos!'})
    }
})
fastify.post('/produtos', async (request, reply) => {
    const {id, nome, preco} = request.body;

    try {
        const conn = await conectar()
        const sql = 'INSERT INTO produtos (id, nome, preco) VALUES (?, ?, ?)';
        await conectar.query(sql, [id, nome, preco]);
        reply.send({ mensagem: 'Produto cadastrado com sucesso!' });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            reply.status(400).send({ mensagem: 'Erro: ID duplicado!' })
        } else{
            console.log(erro);
            reply.status(500).send({ mensagem: 'Erro ao cadastrar produto' });
        }
    }
})
fastify.listen({ port: 8000, host: 'localhost' }, (erro, endereco) => {
    if (erro) {
        console.log('Erro ao inicializar o servidor')
        process.exit(1);
    }
    console.log(`Servidor rodando em ${endereco}`)
})