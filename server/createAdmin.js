import "dotenv/config";
import sequelize from "./config/db.js";
import { User } from "./models/index.js";

const email = "sokolorachaelgospel@gmail.com";
const password = "veltrixnet"; // see the note below about changing this

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (user) {
      user.password = password; // hashed automatically on save
      user.role = "admin";
      await user.save();
      console.log(`Admin updated: ${email}`);
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