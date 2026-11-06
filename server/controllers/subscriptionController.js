import { Subscription, Package } from "../models/index.js";

// Status is worked out from the expiry date, so it is never out of date
const withStatus = (sub) => {
  const data = sub.toJSON();
  const now = new Date();
  const expiry = new Date(data.expiryDate);
  data.status = expiry >= now ? "active" : "expired";
  data.daysLeft =
    expiry >= now ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : 0;
  return data;
};

// GET /api/subscriptions/me  (latest subscription, or null)
export const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      where: { userId: req.user.id },
      include: [{ model: Package, as: "package" }],
      order: [["expiryDate", "DESC"]],
    });
    res.json({ subscription: sub ? withStatus(sub) : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/subscriptions/history  (all past and current months)
export const getHistory = async (req, res) => {
  try {
    const subs = await Subscription.findAll({
      where: { userId: req.user.id },
      include: [{ model: Package, as: "package" }],
      order: [["startDate", "DESC"]],
    });
    res.json({ history: subs.map(withStatus) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};