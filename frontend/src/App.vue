<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push('/login') // redireciona para o login após o logout
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Início</RouterLink>

        <RouterLink
          v-if="userStore.isAuthenticated && userStore.userRole === 'patient'"
          to="/meus-agendamentos"
        >
          Meus Agendamentos
        </RouterLink>

        <RouterLink
          v-if="userStore.isAuthenticated && userStore.userRole === 'secretary'"
          to="/admin"
        >
          Painel Admin
        </RouterLink>

        <RouterLink v-if="!userStore.isAuthenticated" to="/login">Login</RouterLink>

        <div v-if="userStore.isAuthenticated" class="user-info">
          <span>Olá, {{ userStore.user.name }}</span>
          <button @click="handleLogout">Sair</button>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
main {
  padding: 2rem;
  min-height: 80vh;
  background: var(--background);
}
</style>
