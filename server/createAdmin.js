import "dotenv/config";
import sequelize from "./config/db.js";
import { User } from "./models/index.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = "obiorachukwuemekaj@gmail.com"; // change to your email
    const password = "ChangeThisPassword123"; // change before running

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      console.log("Admin already exists");
    } else {
      await User.create({
        name: "VeltrixNet Admin",
        email,
        houseAddress: "VeltrixNet Office",
        password,
        role: "admin",
      });
      console.log(`Admin created: ${email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

run();