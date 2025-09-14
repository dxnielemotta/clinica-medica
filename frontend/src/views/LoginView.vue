<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// estado reativo para os campos do formulário e mensagens de erro
const email = ref('')
const password = ref('')
const errorMessage = ref(null)

async function handleLogin() {
  try {
    errorMessage.value = null // limpa erros anteriores

    // chamada pro backend, passando o email e a senha que o usuario digitou e o backend retornara um user
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    const { user, token } = response.data

    // usa a action da store para salvar o estado do usuário
    userStore.setUser(user, token)

    // redireciona o usuário com base no role dele
    if (user.role === 'secretary') {
      router.push('/admin')
    } else {
      router.push('/meus-agendamentos')
    }
  } catch (error) {
    errorMessage.value = 'Email ou senha inválidos. Tente novamente.'
    console.error('Erro no login:', error)
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Entrar no Sistema</h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required placeholder="seu@email.com" />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="password" required placeholder="********" />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin: 1rem 0rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
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
button:hover {
  background-color: #0056b3;
}
.error-message {
  color: red;
  margin-bottom: 1rem;
}
</style>
