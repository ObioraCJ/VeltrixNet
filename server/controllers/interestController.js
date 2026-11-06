import { Interest } from "../models/index.js";

// POST /api/interest (public)
export const createInterest = async (req, res) => {
  try {
    const { name, email, houseAddress } = req.body;

    if (!name || !email || !houseAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Interest.create({ name, email, houseAddress });
    res.status(201).json({
      message: "Thank you! We will contact you shortly.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};