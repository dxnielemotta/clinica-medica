<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  isSecretary: false,
  address: {
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    localidade: '',
    uf: '',
  },
})

const errorMessage = ref(null)
const successMessage = ref(null)

async function fetchAddressFromCep() {
  errorMessage.value = null
  const cep = formData.value.address.cep.replace(/\D/g, '') // remove caracteres não numéricos

  if (cep.length === 8) {
    try {
      const response = await api.get(`/utils/cep/${cep}`)
      const { logradouro, bairro, localidade, uf } = response.data

      // Preenche os campos do endereço automaticamente
      formData.value.address.logradouro = logradouro
      formData.value.address.bairro = bairro
      formData.value.address.localidade = localidade
      formData.value.address.uf = uf
    } catch (error) {
      errorMessage.value = 'CEP não encontrado. Por favor, verifique.'
      console.error('Erro ao buscar CEP:', error)
    }
  }
}

async function handleRegister() {
  errorMessage.value = null
  successMessage.value = null

  try {
    // transforma o booleano 'isSecretary' para a string 'role' que o backend espera
    const role = formData.value.isSecretary ? 'secretary' : 'patient'

    // monta o objeto final para enviar ao backend
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      role: role,
      address: formData.value.address,
    }

    // chama a api de cadastro
    await api.post('/auth/register', payload)

    successMessage.value = 'Cadastro realizado com sucesso! Redirecionando para o login...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Ocorreu um erro no cadastro.'
    console.error('Erro no cadastro:', error)
  }
}
</script>

<template>
  <div class="register-container">
    <form @submit.prevent="handleRegister" class="register-form">
      <h2>Criar Conta</h2>

      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input id="name" type="text" v-model="formData.name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="formData.email" required />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="formData.password" required />
      </div>

      <hr />

      <div class="form-group">
        <label for="cep">CEP</label>
        <input id="cep" type="text" v-model="formData.address.cep" @blur="fetchAddressFromCep" />
      </div>

      <div class="form-group">
        <label for="logradouro">Rua / Logradouro</label>
        <input id="logradouro" type="text" v-model="formData.address.logradouro" />
      </div>

      <div class="form-group">
        <label for="numero">Número</label>
        <input id="numero" type="text" v-model="formData.address.numero" />
      </div>

      <div class="form-group">
        <label for="bairro">Bairro</label>
        <input id="bairro" type="text" v-model="formData.address.bairro" />
      </div>

      <div class="form-group">
        <label for="localidade">Cidade</label>
        <input id="localidade" type="text" v-model="formData.address.localidade" />
      </div>

      <div class="form-group">
        <label for="uf">Estado (UF)</label>
        <input id="uf" type="text" v-model="formData.address.uf" />
      </div>

      <hr />

      <div class="form-group-checkbox">
        <input id="isSecretary" type="checkbox" v-model="formData.isSecretary" />
        <label for="isSecretary">Sou um funcionário(a)</label>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<style scoped>
/* Usando estilos similares ao do Login para consistência */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}
.register-form {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin: 1rem 0rem;
}
.form-group-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[type='checkbox'] {
  width: auto;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:hover {
  background-color: #218838;
}
.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}
.success-message {
  color: green;
  margin-bottom: 1rem;
  text-align: center;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}
</style>
