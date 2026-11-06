import { Payment, Package } from "../models/index.js";

// POST /api/payments/transfer  (customer says "I have paid")
export const submitTransfer = async (req, res) => {
  try {
    const { packageId, months, reference } = req.body;
    const monthCount = Number(months);

    if (!packageId || !reference || !reference.trim()) {
      return res
        .status(400)
        .json({ message: "Package and transfer reference are required" });
    }
    if (!Number.isInteger(monthCount) || monthCount < 1 || monthCount > 12) {
      return res.status(400).json({ message: "Months must be 1 to 12" });
    }

    const pkg = await Package.findByPk(packageId);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ message: "Package not found" });
    }

    const cleanRef = reference.trim();
    const duplicate = await Payment.findOne({ where: { reference: cleanRef } });
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "This reference has already been submitted" });
    }

    // Amount is always calculated on the server, never trusted from the browser
    const payment = await Payment.create({
      userId: req.user.id,
      packageId: pkg.id,
      months: monthCount,
      amount: pkg.finalPrice * monthCount,
      reference: cleanRef,
      method: "transfer",
      status: "pending",
    });

    res.status(201).json({
      message: "Payment submitted. We will confirm it shortly.",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/me
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Package, as: "package" }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};