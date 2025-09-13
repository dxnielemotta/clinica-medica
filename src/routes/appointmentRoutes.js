import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// ninguém pode acessar /appointments sem um token válido.
router.use(authMiddleware);

router.get("/", getAppointments);
router.post("/", createAppointment);

export default router;
