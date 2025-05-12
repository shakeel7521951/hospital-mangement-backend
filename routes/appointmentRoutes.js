import express from 'express';
import { createAppointment, getAllAppointments, updateStatus } from "../controller/appointmentController.js";
import auth from '../middleware/AuthMiddleWare.js';
const router = express.Router();

router.post("/create-appointment",auth,createAppointment);
router.get("/all-appointments",auth,getAllAppointments);
router.put("/orders/:orderId/status",auth ,updateStatus);

export default router;