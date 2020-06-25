//importar a biblioteca do express
var express = require('express');
//referencia a biblioteca mysql
const dbMysql = require('mysql');

//incluir a requisição do json parse
const bodyParser = require('body-parser');

//criar um objeto do express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Executar Queries
function executarSql(sql, response) {
    //configurações da base de dados
    const db = dbMysql.createConnection({
        host: "projetogmoura.mysql.database.azure.com",
        user: "gmoura@projetogmoura",
        password: "16072018@Guilherm&",
        database: "projetogmoura",
        port: 3306,
        ssl: true
    });


    //Conectar na base de dados
    db.connect(function (erro) {
        if (erro)
            throw erro;
        console.log("Conectado com sucesso!");
    });

    db.query(sql, function (erros, results, fields) {
        if (erros)
            response.json(erros);
        else
            response.json(results);
        db.end();
    });
    console.log('Query executando com sucesso!');
};

//Retornar usuários
app.get('/usuarios', function (request, response) {
    const sqlQuery = "select * from usuario";
    executarSql(sqlQuery, response);
});

//Retornar apenas um usuário
app.get('/usuarios/:id', function (request, response) {
    let id = request.params.id;
    const sqlQuery = `select * from usuario where idUsuario = ${id} ;`;
    executarSql(sqlQuery, response);
});

//Salvar informações na tabela usuário
app.post('/usuarios', function (request, response) {
    const { usuario, senha } = request.body;
    const sql = `insert into usuario(usuario, senha) values('${usuario}', '${senha}')`;
    console.log(sql);
    executarSql(sql, response);
});

//endpoint de delete
app.delete('/usuarios/:id', function (request, response) {
    const id = request.params.id;
    const sql = `delete from usuario where idUsuario = '${id}'`;
    executarSql(sql, response);
});

app.put('/usuarios/', function (request, response) {
    const { usuario, senha, idUsuario } = request.body;
    const sql = `update usuario set usuario = '${usuario}', '${senha}' where idUsuario - ${idUsuario}`;
    executarSql(sql, response);
});

//ponto de acesso - endpoint
//request = requisições
//response = resposta para as solicitações
app.get('/', function (request, response) {
    response.send('Hello Word');
});


app.get('/clientes', function (request, response) {
    let clients = {
        "nome": "Guilherme Moura",
        "idade": 21
    }
    response.json(clients);
});

//novo endpoint
app.get('/produtos', function (request, response) {
    let produtos = {
        "Nome": "Guitarra Les Paul Gibson ",
        "Preço": "20K",
        "Peso": "6,0 Kg"
    }
    response.json(produtos);
});
//escutar a porta 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;