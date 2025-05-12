import express from 'express';
import auth from '../middleware/AuthMiddleWare.js';
import { addDoctor, deleteDoctor, editDoctor, getDoctors } from '../controller/doctorController.js';
import upload from '../middleware/multerConfig.js';
const router = express.Router();

router.post('/add-doctor',upload.single("doctorImage"),auth,addDoctor);
router.get('/get-doctors',auth,getDoctors);
router.delete('/delete-doctors/:id',auth,deleteDoctor);
router.put('/edit-doctors/:id',upload.single("doctorImage"),auth,editDoctor);

export default router;