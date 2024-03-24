import funcs from "../src/app.js";
import { Sequelize, QueryTypes } from "sequelize";

test('Szamok szorzasa', () => {
  expect(funcs.multiplication(5, 4)).toBe(20);
});

test('km/h atvaltas m/s-re', () => {
    expect(funcs.speed(120, 2)).toBe(16.666666666666668);
  });
  
test('Adatbázis hossza', async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });
  const data = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT });
  const dataLenght = data.length;
  expect(dataLenght).toBeGreaterThanOrEqual(4);
});