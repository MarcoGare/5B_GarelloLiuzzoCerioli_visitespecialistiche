const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
           if (err) {
              console.error(err);
              reject();
           }
           console.log('done');
           resolve(result);
        });
    })
}

const database = {
    createTable: async() => {
        await executeQuery(`
       CREATE TABLE IF NOT EXISTS type (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(20)
        )`);
        
        return await executeQuery(`
        CREATE TABLE IF NOT EXISTS visit (
        id int PRIMARY KEY AUTO_INCREMENT,
        idType int NOT NULL,
        date DATE NOT NULL,
        hour INT NOT NULL,
        name VARCHAR(50),
        FOREIGN KEY (idType) REFERENCES type(id) `);      
    },
    insert: async (visit) =>{
        let sql = `
         INSERT INTO visit(idType, date, hour, name)
         VALUES (
            '${visit.idType}', 
            '${visit.date}', 
            '${visit.hour}', 
            ${visit.name},)
            `;
      const result = await executeQuery(sql);
      visit.plates.forEach(async (element) => {
         sql = `
            INSERT INTO plates(idType
            VALUES (
               '${element}', 
               ${result.insertId})
         `;
         await executeQuery(sql);
      });
   },
    select: () =>{
        const sql = `
        SELECT b.id, t.name type, b.date, b.hour, b.name
        FROM visit AS b
        JOIN type as t ON b.idType = t.id
        WHERE date='aaaa-mm-gg'`;
        return executeQuery(sql);
    },
    delete: (id) =>{
        let sql = `
        DELETE FROM visit WHERE id=$ID`;
        sql = sql.replace("$ID",id);
        return executeQuery(sql);
    },
}

module.exports = database;