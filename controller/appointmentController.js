import Appointment from '../Models/Appointent.js';

export const createAppointment = async (req, res) => {
  try {
    const { name, email, date, time, doctor, reason } = req.body;

    if (!name || !email || !date || !time || !doctor) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newAppointment = new Appointment({
      name,
      email,
      date,
      time,
      doctor,
      reason,
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor','name email speciality');
    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found.' });
    }

    res.status(200).json(appointments); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedOrder = await Appointment.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
