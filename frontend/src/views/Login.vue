<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Bem-vindo de volta</h2>
        <p class="text-gray-500 mt-2">Acesse seu painel para gerenciar consultas</p>
      </div>

      <transition name="fade">
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r flex items-center gap-2">
        {{ error }}
        </div>
      </transition>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="email" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="seu@email.com" required :disabled="isLoading">
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Senha</label>
          <input v-model="senha" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="••••••••" required :disabled="isLoading">
        </div>
        
        <button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Autenticando...' : 'Entrar no Sistema' }}
        </button>
      </form>
      
      <p class="mt-8 text-center text-sm text-gray-600 border-t pt-6">
        Ainda não é paciente? <router-link to="/register" class="text-blue-600 font-bold hover:underline">Crie sua conta</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const senha = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    
    const response = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    
    setTimeout(() => {
      if (response.data.role === 'secretario') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 500);
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro de conexão ao tentar fazer login.';
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>