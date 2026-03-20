<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
    <main class="flex-grow flex items-center justify-center p-6">
      <div class="max-w-5xl w-full text-center space-y-10 py-12">
        
        <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Sua saúde em primeiro lugar, <br class="hidden md:block" />
          <span class="text-blue-600">sem filas e sem complicação.</span>
        </h1>
        
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Agende suas consultas de forma rápida e inteligente. Acompanhe seu histórico e receba a previsão do tempo para o dia da sua visita em nosso sistema 100% digital.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <router-link to="/register" class="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
            Agendar Primeira Consulta
          </router-link>
          <router-link to="/login" class="bg-white text-blue-700 border-2 border-blue-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-blue-600 hover:bg-blue-50 transition shadow-sm">
            Já sou paciente
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-16 border-t border-gray-200 text-left">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 class="font-bold text-xl mb-2 text-gray-800">Agendamento 24h</h3>
            <p class="text-gray-600">Escolha o melhor horário para você, a qualquer momento do dia ou da noite, direto do seu celular.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 class="font-bold text-xl mb-2 text-gray-800">Previsão do Tempo</h3>
            <p class="text-gray-600">Saiba exatamente como estará o clima na nossa cidade no dia e horário exato da sua consulta.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 class="font-bold text-xl mb-2 text-gray-800">Dados Seguros</h3>
            <p class="text-gray-600">Suas informações médicas são protegidas com segurança de ponta e acesso exclusivo por senha.</p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>