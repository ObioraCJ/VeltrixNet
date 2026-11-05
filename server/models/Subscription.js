import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Subscription = sequelize.define("Subscription", {
  startDate: { type: DataTypes.DATE, allowNull: false },
  expiryDate: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("active", "expired"),
    defaultValue: "active",
  },
});

export default Subscription;