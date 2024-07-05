import express from "express";
import {check} from "../controllers/checkController.js";

const router=express.Router();

router.get('/check',check);

export default router; 