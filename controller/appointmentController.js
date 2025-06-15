import Appointment from "../Models/Appointent.js";
import Doctor from "../Models/Doctor.js";
import sendMail from "../middleware/SendMail.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time, doctor, reason } = req.body;
    const { name, email, id: userId } = req.user;

    if (!name || !email || !date || !time || !doctor) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
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

    // Fetch doctor info
    const doctorInfo = await Doctor.findById(doctor);
    const doctorEmail = doctorInfo?.email;

    // Email to user
    const userSubject = "✅ Appointment Request Received – Your Booking Details";
    const userText = `
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your appointment request. Below are the details:</p>
      <ul>
        <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Doctor:</strong> ${doctorInfo?.name || "Doctor"}</li>
        <li><strong>Reason:</strong> ${reason || "Not specified"}</li>
      </ul>
      <p>You will be notified once the doctor confirms your appointment.</p>
      <p>Thank you for choosing our healthcare platform.</p>
      <p>Best regards,<br><strong>Online Doctor Booking Team</strong></p>
    `;

    // Email to doctor
    const doctorSubject = "📥 New Appointment Request Received";
    const doctorText = `
      <p>Dear Dr. <strong>${doctorInfo?.name || ""}</strong>,</p>
      <p>You have received a new appointment request. Details are as follows:</p>
      <ul>
        <li><strong>Patient Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Reason:</strong> ${reason || "Not provided"}</li>
      </ul>
      <p>Please log in to your dashboard to review and respond to the request.</p>
      <p>Regards,<br><strong>Online Doctor Booking Platform</strong></p>
    `;

    // Send emails
    await sendMail(email, userSubject, userText);
    if (doctorEmail) {
      await sendMail(doctorEmail, doctorSubject, doctorText);
    }

    res.status(201).json({
      message: "Appointment request submitted successfully. Confirmation will follow shortly.",
    });

  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    res.status(500).json({
      message: "An error occurred while booking the appointment. Please try again later.",
      error,
    });
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
      return res.status(400).json({ message: "Status is required." });
    }

    const order = await Appointment.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    order.status = status;
    await order.save();

    const emailSubject = `📢 Appointment Status Updated – ${status}`;

    const emailBody = `
      <p>Dear <strong>${order.name || "Patient"}</strong>,</p>
      <p>We would like to inform you that the status of your appointment has been updated.</p>
      <ul>
        <li><strong>Appointment ID:</strong> ${order._id}</li>
        <li><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${order.time}</li>
        <li><strong>Status:</strong> <span style="color: green;">${status}</span></li>
      </ul>
      <p>If you have any questions or concerns, please feel free to contact our support team.</p>
      <p>Thank you for using our doctor appointment booking service.</p>
      <p>Best regards,<br><strong>Online Doctor Booking Team</strong></p>
    `;

    await sendMail(order.email, emailSubject, emailBody);

    res.status(200).json({
      message: "Appointment status updated and notification email sent successfully.",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error. Please try again later." });
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
