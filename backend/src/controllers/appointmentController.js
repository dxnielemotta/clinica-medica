import Appointment from "../models/Appointment.js";
import { startOfDay, endOfDay, parse, isValid, format } from "date-fns";
import User from "../models/User.js";

export const createAppointment = async (req, res) => {
  try {
    const { specialty, date, time } = req.body;
    // o id do paciente vem do middleware de autenticação (req.userId)
    const { userId } = req;

    if (!specialty || !date || !time) {
      return res.status(400).json({ error: "Especialidade, data e hora são obrigatórios." });
    }

    const combinedDateTime = `${date} ${time}`;
    const appointmentDateTime = parse(combinedDateTime, "yyyy-MM-dd HH:mm", new Date());

    if (!isValid(appointmentDateTime)) {
      return res.status(400).json({ error: "Data ou hora inválida." });
    }

    const existingAppointment = await Appointment.findOne({
      date: appointmentDateTime,
      status: { $ne: "canceled" },
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "Este horário já foi agendado. Por favor, escolha outro." });
    }

    const newAppointment = await Appointment.create({
      specialty,
      date: appointmentDateTime,
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
    let appointmentsQuery;

    if (userRole === "secretary") {
      // populamos o endereço completo do paciente para pegar a cidade.
      appointmentsQuery = Appointment.find().populate("patient", "name email address").sort({ date: "asc" });
    } else {
      // paciente só vê os seus próprios agendamentos.
      appointmentsQuery = Appointment.find({ patient: userId }).sort({ date: "asc" });
    }

    const appointments = await appointmentsQuery;

    const appointmentsWithWeather = await Promise.all(
      appointments.map(async (appointment) => {
        const appointmentObject = appointment.toObject(); // converte o documento do Mongoose para um objeto JS
        let city = null;

        // tenta obter a cidade do paciente
        if (userRole === "secretary" && appointment.patient.address) {
          city = appointment.patient.address.city;
        } else if (userRole === "patient") {
          // se for paciente, precisamos buscar os dados do próprio usuário
          const patientData = await User.findById(userId);
          if (patientData && patientData.address) {
            city = patientData.address.city;
          }
        }

        // se encontramos uma cidade e temos uma chave de API, consultamos o clima
        if (city && process.env.WEATHER_API_KEY) {
          try {
            const apiKey = process.env.WEATHER_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${apiKey}&units=metric&lang=pt_br`;

            const weatherResponse = await axios.get(url);
            const weatherMain = weatherResponse.data.weather[0].main;

            // condições que consideramos como "alerta de chuva"
            if (["Rain", "Thunderstorm", "Drizzle", "Snow"].includes(weatherMain)) {
              appointmentObject.weatherAlert = `Alerta: Previsão de ${weatherResponse.data.weather[0].description}.`;
            }
          } catch (error) {
            console.error("Falha ao buscar clima para a cidade:", city);
          }
        }

        return appointmentObject;
      })
    );

    return res.status(200).json(appointmentsWithWeather);
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

export const getAvailability = async (req, res) => {
  try {
    const { date } = req.query; // Ex: date=2025-09-13
    if (!date) {
      return res.status(400).json({ error: "A data é obrigatória." });
    }

    // define todos os horários de atendimento do dia
    const allSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

    // encontra os agendamentos já marcados para o dia especificado
    const targetDate = parse(date, "yyyy-MM-dd", new Date());

    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    const bookedAppointments = await Appointment.find({
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: "canceled" }, // não considera horários cancelados como ocupados
    });

    // extrai apenas os horários (HH:mm) dos agendamentos marcados
    const bookedSlots = bookedAppointments.map((appointment) => {
      return format(appointment.date, "HH:mm");
    });

    // filtra a lista completa, retornando apenas os horários que não estão na lista de agendados
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    return res.status(200).json(availableSlots);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao buscar horários.", details: error.message });
  }
};
