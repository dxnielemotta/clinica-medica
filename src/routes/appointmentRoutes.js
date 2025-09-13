import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointments, getAvailability, updateAppointment } from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// ninguém pode acessar /appointments sem um token válido.
router.use(authMiddleware);

router.get("/availability", getAvailability);
router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
