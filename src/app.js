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
const routerForUsers = require('./routerForUsers');

app.use('/users',routerForUsers);
app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use((req, res, next)=>{
  if(req.query.errorMes === 'unauthozized'){
      res.locals.errorMes = `Validation problem.`
  }else{
      res.locals.errorMes = ``
  }
  next()
});

app.get('/', (req, res, next)=>{
  const errorMes = req.query.errorMes;
  if(errorMes === 'unauthozized'){
  }
  res.render('login')
});

app.post('/process_login',(req, res, next)=>{
  const password = req.body.password;
  const username = req.body.username;
  (async () => {
    res.locals.pass = await sequelize.query("SELECT pw FROM `Employees` WHERE name LIKE :search_name", { 
      replacements: { search_name: username }, type: QueryTypes.SELECT }); 
  
    if(password == res.locals.pass[0].pw){
      res.cookie('username',username)
      res.redirect('/welcome')
    }else{
      res.redirect('/?msg=unauthorized')
    }

  })();
});

app.get('/welcome',(req, res, next)=>{
  if(typeof req.cookies.username === 'undefined') {
    res.redirect('/?msg=unauthorized')
  }else{
    res.render('welcome',{
      username: req.cookies.username,
      firstKey: "Ez az első kulcs értéke!",
      secondKey: "Ez a második kulcs értéke!"
    });
}});

app.param('id',(req, res, next, id)=>{
  next();
});

app.get('/info/:infoId/:link',(req, res, next)=>{
  res.send(`<h1>Main ${req.params.infoId} - ${req.params.link}</h1><p><a href="/logout">Log out</a></p>`)
});

app.get('/logout',(req, res, next)=>{
  res.clearCookie('username');
  res.redirect('/')
});


app.listen( port, console.log( `http://127.0.0.1:${ port }` ) );