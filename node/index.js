const express = require('express')
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);
const table = "people";
const query = `
    SELECT COUNT(*) AS count
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
    AND table_name = ?`;

connection.query(query, [table], (error, results) => {
    if(error) {
        console.error('Erro ao verificar tabela:', error);
        return;
    }

    if(results[0].count > 0) {
        insertPerson(connection);
    } else {
        createTablePeople(connection);
        insertPerson(connection);
    }
});

app.get('/', (req, res) => {
    const getSql = `SELECT * from people`;
    let names = '';
    connection.query(getSql, (error, results) => {
        console.log(results);
        if(error) {
            console.error("Erro ao consultar tabela people.");
        }

        for (let i = 0; i < results.length; i++) {
            if(i == 0) {
                names += results[i].name;
            } else {
                names += ", " + results[i].name;
            }

        }
        res.send('<h1>Full Cycle Rocks!</h1>\n' + names);
    })
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})

function createTablePeople(connection) {
    const sql = `CREATE TABLE people(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(25) NOT NULL)`;
    connection.query(sql);
}

function insertPerson(connection) {
    const sql = `INSERT INTO people(name) values('Marcos')`;
    connection.query(sql);
}