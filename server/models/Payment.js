import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define("Payment", {
  amount: { type: DataTypes.INTEGER, allowNull: false },
  months: { type: DataTypes.INTEGER, defaultValue: 1 },
  method: { type: DataTypes.ENUM("transfer"), defaultValue: "transfer" },
  reference: { type: DataTypes.STRING, allowNull: false }, // transfer reference/narration
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "rejected"),
    defaultValue: "pending",
  },
  confirmedAt: { type: DataTypes.DATE },
});

export default Payment;