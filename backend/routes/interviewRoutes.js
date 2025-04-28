import express from "express";
import { createInterview, analyzeInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/generate", createInterview) ;
router.post("/analyze", analyzeInterview) ;

export default router;
