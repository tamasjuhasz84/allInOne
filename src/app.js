//Database connection part
const { Sequelize, QueryTypes, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  age: DataTypes.INTEGER,
  os: {
    type: DataTypes.TEXT,
    defaultValue: 'windows'
  },
  activeWorker: DataTypes.BOOLEAN,
  pw: DataTypes.INTEGER,
}, {
  tableName: 'Employees',
  hooks: {
    beforeCreate: (user, options) => {
      if (user.name == 'Admin') {
        throw new Error('Admin user cannot be created');
      }
    },
    afterCreate: (user, options) => {
      console.log('Sikeres adatbázis művelet!');
      console.log(user.name);
      console.log(user.age);
    }
  }
});


const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
var admin = express()
//const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 1024;
const routerForUsers = require('./routerForUsers');

app.use('/users', routerForUsers);
//app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//log config part
const log4js = require("log4js");
const logger = log4js.getLogger();
log4js.configure({
  appenders: {
    app: { type: "file", filename: "app.log" }
  },
  categories: {
    default: {
      appenders: ['app'],
      level: "debug"
    }
  }
});

//Functions
function multiplication(a, b) {
  return a * b;
};

function division(a, b) {
  return a / b;
};

function subtraction(a, b) {
  return a - b;
};

function speed(a, b) {
  return (a / b) / 3.6;
};

async function employees(req, res, next) {
  res.locals.employees = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT });
  next();
};

module.exports.multiplication = multiplication;
module.exports.speed = speed;
module.exports.division = division;
module.exports.subtraction = subtraction;

app.use(employees);
app.use((req, res, next) => {
  if (req.query.errorMes === 'unauthozized') {
    res.locals.errorMes = `Validation problem.`
  } else {
    res.locals.errorMes = ``
  }
  next()
});

app.get('/', (req, res, next) => {
  const errorMes = req.query.errorMes;
  if (errorMes === 'unauthozized') {
  }
  res.render('login')
});

app.post('/process_login', (req, res, next) => {
  const password = req.body.password;
  const username = req.body.username;
  (async () => {
    res.locals.pass = await sequelize.query("SELECT pw FROM `Employees` WHERE name LIKE :search_name", {
      replacements: { search_name: username }, type: QueryTypes.SELECT
    });

    if (password == res.locals.pass[0].pw) {
      res.cookie('username', username)
      res.redirect('/welcome')
      logger.info(username + ' logged in!')
    } else {
      res.redirect('/?msg=unauthorized')
      logger.warn('Unauthozized attempt!')
    }

  })();
});

app.get('/welcome', (req, res, next) => {
  if (typeof req.cookies.username === 'undefined') {
    res.redirect('/?msg=unauthorized')
  } else {
    res.render('welcome', {
      username: req.cookies.username,
      firstKey: "Ez az első kulcs értéke!",
      secondKey: "Ez a második kulcs értéke!"
    });
  }
});

app.param('id', (req, res, next, id) => {
  next();
});

app.get('/info/:infoId/:link', (req, res, next) => {
  res.send(`<h1>Main ${req.params.infoId} - ${req.params.link}</h1><p><a href="/logout">Log out</a></p>`)
});

app.get('/functions', (req, res, next) => {
  if (typeof req.cookies.username === 'undefined') {
    res.redirect('/?msg=unauthorized')
  } else {
    res.render('functions', {
      resultNum: req.cookies.resultNum,
      speedResultNum: req.cookies.speedResultNum,
      resDataMes: req.cookies.resDataMes,
      countEmployees: req.cookies.countEmployees
    });
  }
  next();
});

app.post('/process_multiplication', (req, res, next) => {
  res.clearCookie('resultNum');
  const resultNum = multiplication(req.body.firstNum, req.body.secondNum);
  res.cookie('resultNum', resultNum);
  logger.debug('Szorzás funkció eredménye: ' + resultNum);
  res.redirect('/functions');
  next();
});

app.post('/process_speed', (req, res, next) => {
  res.clearCookie('speedResultNum');
  const speedResultNum = speed(req.body.distance, req.body.time);
  res.cookie('speedResultNum', speedResultNum);
  logger.debug('Átváltás eredménye : ' + speedResultNum);
  res.redirect('/functions');
  next();
});

app.post('/process_create', (req, res, next) => {
  res.clearCookie('resDataMes');
  const name = req.body.name;
  const age = req.body.age;
  const os = req.body.os;
  const activeWorker = req.body.activeWorker;
  const pw = req.body.pw;
  if (name != "" && age != "" && activeWorker != "" && pw != "") {
    (async () => {
      await sequelize.sync();
      await User.create({ name: name, age: age, os: os, activeWorker: activeWorker, pw: pw });
    })();
    res.cookie('resDataMes', "Sikeres beküldés!");
    logger.debug('Sikeres beküldés!');
    res.redirect('/functions');
  } else {
    res.cookie('resDataMes', "Sikertelen beküldés!");
    logger.debug('Sikertelen beküldés!');
    res.redirect('/functions');
  }
  next();
});

app.post('/process_query', (req, res, next) => {
  res.clearCookie('countEmployees');
  var countEmployees = res.locals.employees.length;
  res.cookie('countEmployees', countEmployees);
  logger.debug('A dolgozók száma összesen : ' + countEmployees);
  res.redirect('/functions');
  next();
});

app.get('/events', (req, res, next) => {
  if (typeof req.cookies.username === 'undefined') {
    res.redirect('/?msg=unauthorized')
  } else {
    res.render('events', {
      firstEvent: multiplication(5, 5),
      secondEvent: division(10, 2),
      thirdEvent: subtraction(20, 7)
    });
  };
  next();
});

app.get('/logout', (req, res, next) => {
  res.clearCookie('username');
  res.clearCookie('resultNum');
  res.clearCookie('speedResultNum');
  res.clearCookie('resDataMes');
  res.clearCookie('countEmployees');
  res.redirect('/')
});

app.listen(port, console.log(`http://127.0.0.1:${port}`));