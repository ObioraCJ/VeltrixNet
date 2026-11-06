import { Op } from "sequelize";
import sequelize from "../config/db.js";
import {
  User,
  Package,
  Subscription,
  Payment,
  Interest,
} from "../models/index.js";

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const now = new Date();
    const [customers, pendingPayments, activeSubs, leads, confirmedTotal] =
      await Promise.all([
        User.count({ where: { role: "customer" } }),
        Payment.count({ where: { status: "pending" } }),
        Subscription.count({ where: { expiryDate: { [Op.gte]: now } } }),
        Interest.count({ where: { contacted: false } }),
        Payment.sum("amount", { where: { status: "confirmed" } }),
      ]);
    res.json({
      customers,
      pendingPayments,
      activeSubs,
      newLeads: leads,
      revenue: confirmedTotal || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/payments?status=pending
export const getPayments = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const payments = await Payment.findAll({
      where,
      include: [
        { model: Package, as: "package" },
        { model: User, attributes: ["id", "name", "email", "houseAddress"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/payments/:id/confirm
export const confirmPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(req.params.id, { transaction: t });
    if (!payment) {
      await t.rollback();
      return res.status(404).json({ message: "Payment not found" });
    }
    if (payment.status !== "pending") {
      await t.rollback();
      return res
        .status(400)
        .json({ message: `Payment is already ${payment.status}` });
    }

    // If the customer is still active, extend from their current expiry
    const latest = await Subscription.findOne({
      where: { userId: payment.userId },
      order: [["expiryDate", "DESC"]],
      transaction: t,
    });
    const now = new Date();
    const startDate =
      latest && new Date(latest.expiryDate) > now
        ? new Date(latest.expiryDate)
        : now;

    await Subscription.create(
      {
        userId: payment.userId,
        packageId: payment.packageId,
        startDate,
        expiryDate: addMonths(startDate, payment.months),
        status: "active",
      },
      { transaction: t }
    );

    payment.status = "confirmed";
    payment.confirmedAt = now;
    await payment.save({ transaction: t });

    await t.commit();
    res.json({ message: "Payment confirmed and subscription activated" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/payments/:id/reject
export const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Payment is already ${payment.status}` });
    }
    payment.status = "rejected";
    await payment.save();
    res.json({ message: "Payment rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/customers
export const getCustomers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "customer" },
      order: [["createdAt", "DESC"]],
    });
    const now = new Date();
    const rows = await Promise.all(
      users.map(async (u) => {
        const sub = await Subscription.findOne({
          where: { userId: u.id },
          include: [{ model: Package, as: "package" }],
          order: [["expiryDate", "DESC"]],
        });
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          houseAddress: u.houseAddress,
          joined: u.createdAt,
          plan: sub ? sub.package.name : null,
          expiryDate: sub ? sub.expiryDate : null,
          status: sub
            ? new Date(sub.expiryDate) >= now
              ? "active"
              : "expired"
            : "none",
        };
      })
    );
    res.json({ customers: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/packages (includes inactive)
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({ order: [["sortOrder", "ASC"]] });
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/packages/:id
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const { basePrice, markup, isActive } = req.body;
    if (basePrice !== undefined) {
      if (!(Number(basePrice) > 0)) {
        return res.status(400).json({ message: "Invalid base price" });
      }
      pkg.basePrice = Number(basePrice);
    }
    if (markup !== undefined) {
      if (!(Number(markup) >= 0)) {
        return res.status(400).json({ message: "Invalid markup" });
      }
      pkg.markup = Number(markup);
    }
    if (isActive !== undefined) pkg.isActive = Boolean(isActive);

    await pkg.save(); // beforeValidate hook recalculates finalPrice
    res.json({ package: pkg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/interests
export const getInterests = async (req, res) => {
  try {
    const interests = await Interest.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ interests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/interests/:id/contacted
export const markContacted = async (req, res) => {
  try {
    const lead = await Interest.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    lead.contacted = true;
    await lead.save();
    res.json({ lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};