const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

const express = require( 'express' );
const app     = express();
const port    = process.env.PORT || 1024;

app.listen( port, console.log( `http://127.0.0.1:${ port }` ) );

(async () => {
    const users = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT });
    app.get('/', (req, res) => {     
            res.send('A teljes adatbázis jelenleg:<br><br>'+JSON.stringify(users))
    });
})();