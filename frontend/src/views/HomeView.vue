<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="home-container">
    <div v-if="!userStore.isAuthenticated" class="welcome-guest">
      <h1>Bem-vindo à Clínica Médica!</h1>
      <p>Sua saúde em primeiro lugar. Agende suas consultas de forma rápida e fácil.</p>
      <div class="actions">
        <RouterLink to="/login" class="btn btn-primary">Entrar</RouterLink>
        <RouterLink to="/cadastro" class="btn btn-secondary">Criar Conta</RouterLink>
      </div>
    </div>

    <div v-else class="welcome-user">
      <h1>Olá, {{ userStore.user.name }}!</h1>
      <p>O que você gostaria de fazer hoje?</p>
      <div class="actions">
        <RouterLink
          v-if="userStore.userRole === 'patient'"
          to="/meus-agendamentos"
          class="btn btn-primary"
        >
          Ver Meus Agendamentos
        </RouterLink>

        <RouterLink v-if="userStore.userRole === 'secretary'" to="/admin" class="btn btn-primary">
          Acessar Painel Administrativo
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-guest h1,
.welcome-user h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.welcome-guest p,
.welcome-user p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
