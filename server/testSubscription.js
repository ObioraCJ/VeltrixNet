import "dotenv/config";
import sequelize from "./config/db.js";
import { User, Package, Subscription } from "./models/index.js";

const email = "test@example.com"; // a customer you signed up with

const run = async () => {
  await sequelize.authenticate();
  const user = await User.findOne({ where: { email } });
  const pkg = await Package.findOne({ where: { name: "Ultra" } });
  if (!user || !pkg) {
    console.log("User or package not found");
    process.exit(1);
  }

  const start = new Date();
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);

  await Subscription.create({
    userId: user.id,
    packageId: pkg.id,
    startDate: start,
    expiryDate: expiry,
    status: "active",
  });
  console.log("Test subscription created");
  process.exit(0);
};

run();