const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.json"
});

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  age: DataTypes.INTEGER,
  os: {
    type: DataTypes.TEXT,
    defaultValue: 'windows'
  },
  activeWorker: DataTypes.BOOLEAN
}, {
  tableName: 'Employees'
});

(async () => {
    await sequelize.drop();
    await sequelize.sync({ force: true });
    await User.create({ name: "Juhasz Tamas", age: 39, activeWorker: true });
    await User.create({ name: "Balogh Tibor", age: 25, os: "Linux", activeWorker: true });
    await User.create({ name: "Varga Anna", age: 45, activeWorker: true });
    await User.create({ name: "Kovacs Imre", age: 30, os: "Linux", activeWorker: false });
})();

