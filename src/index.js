const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.json"
  });

const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

(async () => {
    const users = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT });
    app.get('/', (req, res) => {        
            res.send('A teljes adatbázis jelenleg:<br><br>'+JSON.stringify(users))
    })
})();