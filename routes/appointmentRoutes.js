import express from 'express';
import { createAppointment, getAllAppointments, getMyAppointments, updateStatus } from "../controller/appointmentController.js";
import auth from '../middleware/AuthMiddleWare.js';
const router = express.Router();

router.post("/create-appointment",auth,createAppointment);
router.get("/all-appointments",auth,getAllAppointments);
router.put("/orders/:orderId/status",auth ,updateStatus);
router.get('/my-appointments', auth, getMyAppointments);

export default router;