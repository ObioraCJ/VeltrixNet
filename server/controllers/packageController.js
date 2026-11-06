import { Package } from "../models/index.js";

// GET /api/packages (public)
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { isActive: true },
      order: [["sortOrder", "ASC"]],
    });
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/packages/:id (public)
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ package: pkg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};