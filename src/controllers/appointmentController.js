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

export const updateAppointment = async (req, res) => {
  // apenas secretários podem atualizar agendamentos
  const { userRole } = req;
  if (userRole !== "secretary") {
    return res.status(403).json({ error: "Acesso negado. Apenas funcionários podem realizar esta ação." });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["scheduled", "confirmed", "canceled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true } // retorna o documento já atualizado
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao atualizar agendamento.", details: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRole, userId } = req;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    // REGRA DE PERMISSÃO:
    // ou o usuário é um secretário, ou é o paciente dono do agendamento.
    if (userRole !== "secretary" && appointment.patient.toString() !== userId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({ message: "Agendamento cancelado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Falha ao cancelar agendamento.", details: error.message });
  }
};
