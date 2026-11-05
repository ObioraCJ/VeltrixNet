import User from "./User.js";
import Package from "./Package.js";
import Subscription from "./Subscription.js";
import Payment from "./Payment.js";
import Interest from "./Interest.js";

// A user has many subscriptions and payments
User.hasMany(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

// A package has many subscriptions and payments
Package.hasMany(Subscription, { foreignKey: "packageId" });
Subscription.belongsTo(Package, { foreignKey: "packageId", as: "package" });

Package.hasMany(Payment, { foreignKey: "packageId" });
Payment.belongsTo(Package, { foreignKey: "packageId", as: "package" });

export { User, Package, Subscription, Payment, Interest };