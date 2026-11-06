import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getStats,
  getPayments,
  confirmPayment,
  rejectPayment,
  getCustomers,
  getAllPackages,
  updatePackage,
  getInterests,
  markContacted,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly); // every admin route needs login + admin role

router.get("/stats", getStats);
router.get("/payments", getPayments);
router.patch("/payments/:id/confirm", confirmPayment);
router.patch("/payments/:id/reject", rejectPayment);
router.get("/customers", getCustomers);
router.get("/packages", getAllPackages);
router.patch("/packages/:id", updatePackage);
router.get("/interests", getInterests);
router.patch("/interests/:id/contacted", markContacted);

export default router;