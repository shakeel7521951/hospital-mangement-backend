import Appointment from "../Models/Appointent.js";
import Doctor from "../Models/Doctor.js";

import User from "../Models/User.js";
import sendMail from "../middleware/SendMail.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time, doctor, reason } = req.body;
    const { name, email, id: userId } = req.user;
    if (!name || !email || !date || !time || !doctor) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const newAppointment = new Appointment({
      name,
      email,
      date,
      time,
      doctor,
      reason,
      user: userId,
    });

    await newAppointment.save();

    // Get doctor info
    const doctorInfo = await Doctor.findById(doctor);
    const doctorEmail = doctorInfo?.email;
    // Send email to user
    const userSubject = "Your Appointment is Confirmed";
    const userText = `
<p>Hi ${name},</p>
<p>
Your appointment has been successfully booked.
</p><p>
📅 Date: ${new Date(date).toLocaleDateString()}
⏰ Time: ${time}
👨‍⚕️ Doctor: ${doctorInfo?.name || "N/A"}
📝 Reason: ${reason || "N/A"}
</p><p>
Thank you for booking with us!
    </p>`;

    // Send email to doctor
    const doctorSubject = "New Appointment Scheduled";
    const doctorText = `
Hi Dr. ${doctorInfo?.name || "Doctor"},

A new appointment has been booked.

👤 Patient: ${name}
📧 Email: ${email}
📅 Date: ${new Date(date).toLocaleDateString()}
⏰ Time: ${time}
📝 Reason: ${reason || "N/A"}

Please check your dashboard for more details.
    `;

    await sendMail(email, userSubject, userText);
    if (doctorEmail) {
      await sendMail(doctorEmail, doctorSubject, doctorText);
    }

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "doctor",
      "name email speciality"
    );
    if (!appointments) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving appointments", error });
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

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({ user: userId }).populate(
      "doctor",
      "name email speciality"
    );

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this user." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving user appointments", error });
  }
};
