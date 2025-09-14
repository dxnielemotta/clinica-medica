<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const appointments = ref([])
const isLoading = ref(true)
const error = ref(null)

// formata a data para um padrão brasileiro
function formatDate(dateString) {
  const date = new Date(dateString)
  return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
}

function translateStatus(status) {
  const statusMap = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    canceled: 'Cancelado',
  }
  // Retorna a tradução ou o status original se não for encontrado
  return statusMap[status] || status
}

// hook do vue que roda assim que o componente é criado
onMounted(async () => {
  try {
    const response = await api.get('/appointments')
    appointments.value = response.data
  } catch (err) {
    error.value = 'Não foi possível carregar seus agendamentos.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <div class="header">
      <h1>Meus Agendamentos</h1>
      <RouterLink to="/agendar" class="btn-agendar">Agendar Nova Consulta</RouterLink>
    </div>

    <div v-if="isLoading">
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="appointments.length === 0">
      <p>Você ainda não possui nenhum agendamento.</p>
    </div>

    <div v-else class="appointments-list">
      <div v-for="app in appointments" :key="app._id" class="appointment-card">
        <h3>{{ app.specialty }}</h3>
        <p><strong>Data:</strong> {{ formatDate(app.date) }}</p>
        <p>
          <strong class="status-title">Status:</strong>
          <span :class="`status-${app.status}`">{{ translateStatus(app.status) }}</span>
        </p>
        <div v-if="app.weatherAlert" class="weather-alert">
          <p>{{ app.weatherAlert }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
.appointment-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.status-title {
  padding-right: 5px;
}
.status-scheduled {
  color: blue;
}
.status-confirmed {
  color: green;
}
.status-canceled {
  color: red;
}
.weather-alert {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}
.error-message {
  color: red;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-agendar {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}
.btn-agendar:hover {
  background-color: #218838;
}
</style>
