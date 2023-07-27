const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

const path = require('path');
const bodyParser = require('body-parser');
const express = require( 'express' );
const app     = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const port    = process.env.PORT || 1024;

app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

async function employees (req,res,next){
  res.locals.employees = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT }); 
  next();
};

app.use(employees);

app.get('/users',(req, res, next)=>{
    res.render('users',{
        proba: res.locals.employees
    });
});

app.get('/',(req, res, next)=>{
  res.render("index", {
      firstKey: "Ez az első kulcs értéke!",
      secondKey: "Ez a második kulcs értéke!"
  });
});

app.listen( port, console.log( `http://127.0.0.1:${ port }` ) );