<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">

      <div class="bg-white p-6 rounded-lg shadow-md mb-6 border-t-4 border-blue-600">
        <h2 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          Nova Consulta
        </h2>
        <form @submit.prevent="agendarConsulta" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold mb-2 text-gray-700">Data e Hora desejada</label>
              <input 
                v-model="form.dataHora" 
                @change="buscarClima"
                type="datetime-local" 
                class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                required
              >
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-gray-700">Observações (Opcional)</label>
              <input 
                v-model="form.observacoes" 
                type="text" 
                placeholder="Ex: Primeira vez, dor leve..."
                class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
            </div>
          </div>

          <transition name="fade">
            <div v-if="clima && !buscandoClima" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <div>
                <h4 class="font-bold text-blue-900">Previsão para {{ clima.name }}</h4>
                <p class="text-sm text-blue-800">
                  A condição atual esperada é de <strong>{{ clima.weather[0].description }}</strong> 
                  com temperatura de <strong>{{ clima.main.temp }}°C</strong>.
                </p>
                <p v-if="clima.weather[0].main === 'Rain'" class="text-xs font-bold text-red-600 mt-1">
                  Atenção: Previsão de chuva. Planeje sua rota com antecedência!
                </p>
              </div>
            </div>
          </transition>
          
          <div v-if="buscandoClima" class="text-sm text-gray-500 animate-pulse mt-4">
            Consultando previsão do tempo...
          </div>

          <p v-if="error" class="text-red-500 text-sm font-semibold mt-4">{{ error }}</p>
          
          <transition name="fade">
            <div v-if="sucesso" class="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded font-medium mt-4">
            {{ sucesso }}
            </div>
          </transition>

          <div class="pt-4">
            <button type="submit" :disabled="isSubmitting" class="w-full md:w-auto bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Processando...' : 'Confirmar Agendamento' }}
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Meu Histórico</h2>
        <ul class="space-y-3">
          <li v-for="appt in appointments" :key="appt._id" class="border border-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
            <div>
              <p class="font-bold text-gray-800">{{ new Date(appt.dataHora).toLocaleString('pt-BR') }}</p>
              <p class="text-sm text-gray-500">{{ appt.observacoes || 'Sem observações' }}</p>
            </div>
            <span :class="{
              'bg-yellow-100 text-yellow-800 border border-yellow-200': appt.status === 'pendente',
              'bg-green-100 text-green-800 border border-green-200': appt.status === 'confirmado',
              'bg-red-100 text-red-800 border border-red-200': appt.status === 'cancelado'
            }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {{ appt.status }}
            </span>
          </li>
          
          <div v-if="!appointments.length" class="text-center py-8">
            <h3 class="text-lg font-bold text-gray-700">Nenhuma consulta agendada</h3>
            <p class="text-gray-500 text-sm">Seu histórico aparecerá aqui após o primeiro agendamento.</p>
          </div>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../services/api';

const appointments = ref([]);
const clima = ref(null);
const error = ref('');
const buscandoClima = ref(false);
const sucesso = ref('');
const isSubmitting = ref(false);

const form = reactive({
  dataHora: '',
  observacoes: ''
});

const carregarAgendamentos = async () => {
  try {
    const response = await api.get('/appointments');
    appointments.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
  }
};

const buscarClima = async () => {
  if (!form.dataHora) return;
  
  buscandoClima.value = true;
  error.value = ''; 
  clima.value = null; 
  
  try {
    const response = await api.get('/weather', {
      params: { data: form.dataHora }
    });
    clima.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      error.value = err.response.data.message;
    } else {
      console.error('Erro ao buscar clima antecipado', err);
    }
  } finally {
    buscandoClima.value = false;
  }
};

const agendarConsulta = async () => {
  try {
    error.value = '';
    sucesso.value = '';
    isSubmitting.value = true;
    
    await api.post('/appointments', form);
    
    form.dataHora = '';
    form.observacoes = '';
    clima.value = null; 
    
    sucesso.value = 'Consulta agendada com sucesso! Aguarde a confirmação.';
    setTimeout(() => sucesso.value = '', 5000);
    
    await carregarAgendamentos();
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao agendar consulta';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(carregarAgendamentos);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>