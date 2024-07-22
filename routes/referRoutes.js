import { Router } from "express";
import { createRefer, fetchrefer } from "../controllers/refferalcontroller.js";
// import { createRefer, fetchrefer } from "../controllers/refferalcontroller";

const router = Router();

//get all refers
router.get("/all", fetchrefer);
// router.get("/google-code", gmail)
//create refer
router.post("/refer-submit", createRefer);


export default router;
