import "dotenv/config";
import sequelize from "./config/db.js";
import { Package } from "./models/index.js";

const packages = [
  {
    name: "Essential",
    speed: 50,
    basePrice: 25000,
    sortOrder: 1,
    features: [
      "Unlimited data",
      "Free WiFi Gateway",
      "Free installation",
      "Basic technical support",
    ],
  },
  {
    name: "Ultra",
    speed: 100,
    basePrice: 42750,
    sortOrder: 2,
    features: ["Unlimited data", "Fast and reliable", "Family subscription"],
  },
  {
    name: "Ultrafast",
    speed: 300,
    basePrice: 75000,
    sortOrder: 3,
    features: [
      "Unlimited data",
      "Free WiFi Gateway",
      "Free installation",
      "Premium technical support",
      "Gaming & 4K streaming",
    ],
  },
  {
    name: "Premium",
    speed: 500,
    basePrice: 150000,
    sortOrder: 4,
    features: [
      "Unlimited data",
      "Free WiFi Gateway",
      "Free installation",
      "Standard technical support",
    ],
  },
  {
    name: "Gigabit",
    speed: 1000,
    basePrice: 195000,
    sortOrder: 5,
    features: [
      "Unlimited data",
      "Free WiFi Gateway",
      "Free installation",
      "24/7 premium support",
      "8K streaming & smart home integration",
    ],
  },
];

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    await Package.destroy({ where: {} }); // clears old packages so you can re-run safely
    for (const p of packages) {
      await Package.create({ ...p, minimumMonths: 12 });
    }

    const saved = await Package.findAll({ order: [["sortOrder", "ASC"]] });
    saved.forEach((p) =>
      console.log(`${p.name} ${p.speed}Mbps -> N${p.finalPrice}`)
    );
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

run();