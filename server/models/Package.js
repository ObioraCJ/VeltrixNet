import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Package = sequelize.define(
  "Package",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    speed: { type: DataTypes.INTEGER, allowNull: false }, // Mbps
    basePrice: { type: DataTypes.INTEGER, allowNull: false }, // Metroreach price
    markup: { type: DataTypes.INTEGER },
    finalPrice: { type: DataTypes.INTEGER }, // basePrice + markup
    features: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
    minimumMonths: { type: DataTypes.INTEGER, defaultValue: 12 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    hooks: {
      beforeValidate: (pkg) => {
        if (pkg.markup === undefined || pkg.markup === null) {
          pkg.markup = Number(process.env.PRICE_MARKUP) || 0;
        }
        pkg.finalPrice = pkg.basePrice + pkg.markup;
      },
    },
  }
);

export default Package;