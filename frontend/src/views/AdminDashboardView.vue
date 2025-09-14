<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const appointments = ref([])
const isLoading = ref(true)
const error = ref(null)

function formatDate(dateString) {
  const date = new Date(dateString)
  return format(date, 'dd/MM/yy HH:mm', { locale: ptBR })
}

function translateStatus(status) {
  const statusMap = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    canceled: 'Cancelado',
  }
  return statusMap[status] || status
}

async function fetchAppointments() {
  isLoading.value = true
  try {
    const response = await api.get('/appointments')
    appointments.value = response.data
  } catch (err) {
    error.value = 'Não foi possível carregar os agendamentos.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAppointments)

async function updateAppointmentStatus(id, newStatus) {
  try {
    const response = await api.put(`/appointments/${id}`, { status: newStatus })

    const index = appointments.value.findIndex((app) => app._id === id)
    if (index !== -1) {
      const patientData = appointments.value[index].patient

      const updatedAppointment = { ...response.data, patient: patientData }

      appointments.value[index] = updatedAppointment
    }
  } catch (err) {
    alert(
      `Não foi possível atualizar o agendamento. Erro: ${err.response?.data?.error || err.message}`,
    )
    console.error(err)
  }
}

function confirmAppointment(id) {
  if (window.confirm('Você tem certeza que deseja CONFIRMAR este agendamento?')) {
    updateAppointmentStatus(id, 'confirmed')
  }
}

function cancelAppointment(id) {
  if (
    window.confirm(
      'Você tem certeza que deseja CANCELAR este agendamento? Esta ação não pode ser desfeita.',
    )
  ) {
    updateAppointmentStatus(id, 'canceled')
  }
}
</script>

<template>
  <div>
    <h1>Painel Administrativo - Agendamentos</h1>

    <div v-if="isLoading">
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <table v-else-if="appointments.length > 0" class="appointments-table">
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Email</th>
          <th>Especialidade</th>
          <th>Data e Hora</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in appointments" :key="app._id">
          <td>{{ app.patient.name }}</td>
          <td>{{ app.patient.email }}</td>
          <td>{{ app.specialty }}</td>
          <td>{{ formatDate(app.date) }}</td>
          <td>
            <span :class="`status-${app.status}`">{{ translateStatus(app.status) }}</span>
            <div v-if="app.weatherAlert" class="weather-alert-small">Alerta de Chuva</div>
          </td>
          <td class="actions">
            <button @click="confirmAppointment(app._id)" class="btn-confirm">Confirmar</button>
            <button @click="cancelAppointment(app._id)" class="btn-cancel">Cancelar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>Nenhum agendamento encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.appointments-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.appointments-table th,
.appointments-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.appointments-table th {
  background-color: #f2f2f2;
}
.status-scheduled {
  color: blue;
  font-weight: bold;
}
.status-confirmed {
  color: green;
  font-weight: bold;
}
.status-canceled {
  color: red;
  font-weight: bold;
}
.actions button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
.btn-confirm {
  background-color: #28a745;
}
.btn-cancel {
  background-color: #dc3545;
}
.weather-alert-small {
  font-size: 0.75rem;
  color: #007bff;
}
</style>
