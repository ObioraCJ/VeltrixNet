import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.DB_SSL === "true"
      ? {
          ssl: { require: true, rejectUnauthorized: false },
          connectTimeout: 30000,
        }
      : {},
  pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
  retry: { max: 3 },
});

export const connectDB = async () => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("PostgreSQL connected");
      await sequelize.sync({ alter: true });
      console.log("Tables synced");
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === 3) process.exit(1);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

export default sequelize;