import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { specialty, date } = req.body;
    // o id do paciente vem do middleware de autenticação (req.userId)
    const { userId } = req;

    const newAppointment = await Appointment.create({
      specialty,
      date,
      patient: userId,
    });

    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(400).json({ error: "Falha ao criar agendamento.", details: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { userRole, userId } = req;
    let appointments;
    if (userRole === "secretary") {
      //funcionario pode ver todos os agendamentos
      appointments = await Appointment.find().populate("patient", "name email");
    } else {
      //paciente só pode ver o seu próprio agendamento
      appointments = await Appointment.find({ patient: userId });
    }

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao buscar agendamentos.", details: error.message });
  }
};
