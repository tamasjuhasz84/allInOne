import { Sequelize, QueryTypes } from "sequelize";
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

import express from "express";
const router = express.Router();
import cookieParser from "cookie-parser";

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

export default router;
