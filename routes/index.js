import { Router } from "express";
import referRoutes from "./referRoutes.js"
const router = Router();

router.use("/api" , referRoutes)

export default router