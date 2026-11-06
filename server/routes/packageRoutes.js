import express from "express";
import { getPackages, getPackageById } from "../controllers/packageController.js";

const router = express.Router();

router.get("/", getPackages);
router.get("/:id", getPackageById);

export default router;