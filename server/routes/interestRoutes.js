import express from "express";
import { createInterest } from "../controllers/interestController.js";

const router = express.Router();

router.post("/", createInterest);

export default router;