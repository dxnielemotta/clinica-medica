import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    // campo que armazena o id do paciente que fez o agendamento
    // 'ref: 'User'' cria uma referência ao model User
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "canceled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
