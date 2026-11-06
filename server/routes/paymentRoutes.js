import express from "express";
import { submitTransfer, getMyPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/transfer", protect, submitTransfer);
router.get("/me", protect, getMyPayments);

export default router;