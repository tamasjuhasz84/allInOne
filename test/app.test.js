const multiplication = require('../src/app').multiplication;
const speed = require('../src/app').speed;

test('Szamok szorzasa', () => {
  expect(multiplication(5, 4)).toBe(20);
});

test('km/h atvaltas m/s-re', () => {
    expect(speed(120, 2)).toBe(16.666666666666668);
  });
  
test('Adatbázis hossza', async () => {
  const { Sequelize, QueryTypes } = require("sequelize");
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });
  const data = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT });
  const dataLenght = data.length;
  expect(dataLenght).toBeGreaterThanOrEqual(4);
});