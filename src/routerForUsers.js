const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

const express = require('express');
const router = express.Router()
const cookieParser = require('cookie-parser');

async function employees (req,res,next){
    res.locals.employees = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT }); 
    next();
  };
  
router.use(employees);
router.use(cookieParser());

router.get('/',(req, res, next)=>{
    if(typeof req.cookies.username === 'undefined') {
        res.redirect('/?msg=unauthorized')
    }else{
        res.render('users',{
            fullTable: res.locals.employees
    });
}});

module.exports = router;
