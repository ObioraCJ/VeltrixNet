import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Interest = sequelize.define("Interest", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  houseAddress: { type: DataTypes.TEXT, allowNull: false },
  contacted: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default Interest;