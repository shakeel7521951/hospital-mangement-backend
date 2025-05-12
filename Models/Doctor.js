import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // optional, but usually a good idea for emails
  },
  phone: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  doctorImage: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: false,
    default: 0,
  },
  education: {
    type: String,
    required: false,
  },
  availableDays: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
