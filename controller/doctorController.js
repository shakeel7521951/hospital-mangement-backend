import Doctor from "../Models/Doctor.js";

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      speciality,
      experience,
      education,
      availableDays
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Doctor image is required" });
    }

    const doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res
        .status(409)
        .json({ message: "Doctor with this email already exists" });
    }

    const imageUrl = file.path;
    await Doctor.create({
      name,
      email,
      phone,
      speciality,
      doctorImage: imageUrl,
      experience,
      education,
      availableDays
    });

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (doctors.length < 1) {
      return res.status(200).json({ message: "No Doctor found!" });
    }
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(402).json({ message: "Id is required" });
    }

    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res.status(402).json({ message: "Error in deleting doctor" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      speciality,
      experience,
      education,
      availableDays
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const availabledays = JSON.parse(req.body.availableDays);

    const filePath = req.file?.path || null;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        speciality,
        doctorImage: filePath || undefined,
        experience,
        education,
        availableDays:availabledays
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
