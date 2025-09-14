<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()

const formData = ref({
  specialty: '',
  date: '',
  time: '',
})

const availableSlots = ref([])
const isLoadingSlots = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)

// "observador" que reage a mudanças na data selecionada
watch(
  () => formData.value.date,
  (newDate) => {
    if (newDate) {
      fetchAvailableSlots(newDate)
    } else {
      availableSlots.value = []
    }
  },
)

// busca os horários disponíveis no backend
async function fetchAvailableSlots(date) {
  isLoadingSlots.value = true
  availableSlots.value = []
  formData.value.time = '' // reseta a hora selecionada
  errorMessage.value = null

  try {
    const response = await api.get(`/appointments/availability?date=${date}`)
    availableSlots.value = response.data
    if (response.data.length === 0) {
      errorMessage.value = 'Nenhum horário disponível para esta data.'
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível buscar os horários.'
    console.error(error)
  } finally {
    isLoadingSlots.value = false
  }
}

// envia o formulário de agendamento
async function handleCreateAppointment() {
  errorMessage.value = null
  successMessage.value = null

  try {
    await api.post('/appointments', {
      specialty: formData.value.specialty,
      date: formData.value.date,
      time: formData.value.time,
    })

    successMessage.value = 'Consulta agendada com sucesso! Redirecionando...'

    setTimeout(() => {
      router.push('/meus-agendamentos')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao agendar.'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Agendar Nova Consulta</h1>
    <form @submit.prevent="handleCreateAppointment" class="appointment-form">
      <div class="form-group">
        <label for="specialty">Especialidade</label>
        <input id="specialty" type="text" v-model="formData.specialty" required />
      </div>

      <div class="form-group">
        <label for="date">Data da Consulta</label>
        <input id="date" type="date" v-model="formData.date" required />
      </div>

      <div v-if="formData.date" class="form-group">
        <label for="time">Horário Disponível</label>
        <div v-if="isLoadingSlots">Carregando horários...</div>
        <select
          v-else
          id="time"
          v-model="formData.time"
          required
          :disabled="availableSlots.length === 0"
        >
          <option disabled value="">Selecione um horário</option>
          <option v-for="slot in availableSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <button type="submit" :disabled="!formData.time">Agendar</button>
    </form>
  </div>
</template>

<style scoped>
.appointment-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.error-message {
  color: red;
}
.success-message {
  color: green;
}
</style>
