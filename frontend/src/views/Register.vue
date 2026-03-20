<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-10 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-gray-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Novo Cadastro</h2>
        <p class="text-gray-500 mt-2">Preencha seus dados para começar a agendar</p>
      </div>

      <transition name="fade">
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r flex items-center gap-2">
          {{ error }}
        </div>
      </transition>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2">Nome Completo</label>
            <input v-model="form.nome" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required :disabled="isLoading">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required :disabled="isLoading">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input v-model="form.senha" type="password" minlength="6" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Mínimo 6 caracteres" required :disabled="isLoading">
          </div>
        </div>

        <div class="border-t pt-5 mt-5">
          <h3 class="text-gray-800 font-bold mb-4">Endereço</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="md:col-span-1 relative">
              <label class="block text-gray-700 text-sm font-bold mb-2">CEP</label>
              <input v-model="form.endereco.cep" @input="formatarCep" @blur="buscarCep" type="text" maxlength="9" placeholder="00000-000" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required :disabled="isLoading">
              <span v-if="isLoadingCep" class="absolute right-3 top-10 text-blue-500 text-xs font-bold animate-pulse">Buscando...</span>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-gray-700 text-sm font-bold mb-2">Cidade</label>
              <input v-model="form.endereco.cidade" type="text" class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none text-gray-600" readonly>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-gray-700 text-sm font-bold mb-2">Logradouro / Rua</label>
              <input v-model="form.endereco.logradouro" type="text" class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none text-gray-600" readonly>
            </div>

            <div class="md:col-span-1">
              <label class="block text-gray-700 text-sm font-bold mb-2">UF</label>
              <input v-model="form.endereco.uf" type="text" class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none text-gray-600" readonly>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="isLoading || isLoadingCep" class="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Criando conta...' : 'Finalizar Cadastro' }}
        </button>
      </form>
      
      <p class="mt-8 text-center text-sm text-gray-600 border-t pt-6">
        Já possui cadastro? <router-link to="/login" class="text-blue-600 font-bold hover:underline">Faça login aqui</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import axios from 'axios';

const router = useRouter();
const error = ref('');
const isLoading = ref(false);
const isLoadingCep = ref(false);

const form = reactive({
  nome: '',
  email: '',
  senha: '',
  role: 'paciente',
  endereco: {
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: ''
  }
});

const formatarCep = () => {
  let valor = form.endereco.cep.replace(/\D/g, '');
  
  if (valor.length > 5) {
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  
  form.endereco.cep = valor;
  if (valor.length === 9) {
    buscarCep();
  }
};

const buscarCep = async () => {
  const cepLimpo = form.endereco.cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    try {
      isLoadingCep.value = true;
      const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!data.erro) {
        form.endereco.logradouro = data.logradouro;
        form.endereco.bairro = data.bairro;
        form.endereco.cidade = data.localidade;
        form.endereco.uf = data.uf;
      }
    } catch (err) {
      console.error('Erro ao buscar CEP');
    } finally {
      isLoadingCep.value = false;
    }
  }
};

const handleRegister = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    
    const response = await api.post('/auth/register', form);
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao processar o cadastro.';
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>