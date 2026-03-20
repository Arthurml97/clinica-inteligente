<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      
      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Painel de Controle</h1>
          <p class="text-gray-500 mt-1">Gerencie os agendamentos da clínica</p>
        </div>
        <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Acesso Restrito</p>
            <p class="text-sm font-bold text-blue-700">Secretaria</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            Todos os Agendamentos
          </h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                <th class="p-4 font-semibold">Paciente</th>
                <th class="p-4 font-semibold">Data e Hora</th>
                <th class="p-4 font-semibold">Observações</th>
                <th class="p-4 font-semibold text-center">Status</th>
                <th class="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="appt in appointments" :key="appt._id" class="hover:bg-blue-50/50 transition duration-150">
                <td class="p-4">
                  <p class="font-bold text-gray-800">{{ appt.paciente?.nome || 'Paciente Deletado' }}</p>
                  <p class="text-xs text-gray-500">{{ appt.paciente?.email || 'N/A' }}</p>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2 text-gray-700">
                    <span class="font-medium">{{ formatarData(appt.dataHora) }}</span>
                  </div>
                </td>
                <td class="p-4 text-sm text-gray-600 max-w-xs truncate" :title="appt.observacoes">
                  {{ appt.observacoes || '---' }}
                </td>
                <td class="p-4 text-center">
                  <span :class="{
                    'bg-yellow-100 text-yellow-800 border-yellow-200': appt.status === 'pendente',
                    'bg-green-100 text-green-800 border-green-200': appt.status === 'confirmado',
                    'bg-red-100 text-red-800 border-red-200': appt.status === 'cancelado'
                  }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-block">
                    {{ appt.status }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <template v-if="appt.status === 'pendente'">
                    <button @click="atualizarStatus(appt._id, 'confirmado')" class="bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm">
                      Confirmar
                    </button>
                    <button @click="atualizarStatus(appt._id, 'cancelado')" class="bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm">
                      Cancelar
                    </button>
                  </template>
                  <span v-else class="text-gray-400 text-sm font-medium italic">Resolvido</span>
                </td>
              </tr>
              <tr v-if="!appointments.length">
                <td colspan="5" class="p-8 text-center text-gray-500">
                  <p>Nenhum agendamento no sistema até o momento.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const appointments = ref([]);

const formatarData = (dataIso) => {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const carregarAgendamentos = async () => {
  try {
    const response = await api.get('/appointments');
    appointments.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
  }
};

const atualizarStatus = async (id, status) => {
  try {
    await api.patch(`/appointments/${id}/status`, { status });
    await carregarAgendamentos();
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
  }
};

onMounted(carregarAgendamentos);
</script>