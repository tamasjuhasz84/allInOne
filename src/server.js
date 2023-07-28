const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");
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
  tableName: 'Employees'
});

(async () => {
    await sequelize.drop();
    await sequelize.sync({ force: true });
    await User.create({ name: "Tamas", age: 39, activeWorker: true, pw: 123 });
    await User.create({ name: "Balazs", age: 25, os: "Linux", activeWorker: true, pw: 456 });
    await User.create({ name: "Anna", age: 45, activeWorker: true, pw: 789 });
    await User.create({ name: "Imre", age: 30, os: "Linux", activeWorker: false, pw: 987 });
})();

