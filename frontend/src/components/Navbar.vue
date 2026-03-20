<template>
  <nav class="bg-blue-700 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-xl font-extrabold flex items-center gap-2 tracking-tight">
        Clínica Inteligente
      </router-link>
      
      <div class="space-x-2 md:space-x-4 flex items-center">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="text-blue-100 hover:text-white font-medium transition">Entrar</router-link>
          <router-link to="/register" class="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition shadow-sm">Cadastrar</router-link>
        </template>
        
        <template v-else>
          <router-link v-if="role === 'secretario'" to="/admin" class="text-blue-100 hover:text-white font-medium transition">Painel Admin</router-link>
          <router-link v-else to="/dashboard" class="text-blue-100 hover:text-white font-medium transition">Meu Painel</router-link>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition shadow-sm ml-2">Sair</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const role = ref('');

const checkAuth = () => {
  isLoggedIn.value = !!localStorage.getItem('token');
  role.value = localStorage.getItem('role') || '';
};

watch(() => route.path, checkAuth);
onMounted(checkAuth);

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  checkAuth();
  router.push('/login');
};
</script>