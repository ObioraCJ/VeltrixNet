import express from "express";
import { getMySubscription, getHistory } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getMySubscription);
router.get("/history", protect, getHistory);

export default router;