// Script para verificar a saúde da aplicação e testar rotas principais
// Executar com: node app-healthcheck.js

const axios = require('axios');
require('dotenv').config();
const credentials = require('./credentials');

// Configuração
const BASE_URL = credentials.TEST_URL;
const PAGES_TO_CHECK = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/feed',
  '/discussions',
  '/events',
  '/library',
  '/points',
  '/store'
];

// Utilitário para log
const log = (message, type = 'info') => {
  const prefix = {
    info: '📘 INFO',
    success: '✅ SUCESSO',
    error: '❌ ERRO',
    warning: '⚠️ AVISO',
    test: '🧪 TESTE'
  }[type];
  
  console.log(`${prefix}: ${message}`);
};

// Verificar uma página
async function checkPage(url) {
  try {
    const fullUrl = `${BASE_URL}${url}`;
    log(`Verificando página: ${fullUrl}`, 'test');
    
    const startTime = Date.now();
    const response = await axios.get(fullUrl);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    const status = response.status;
    
    if (status >= 200 && status < 300) {
      log(`Página ${url} respondeu com status ${status} em ${responseTime}ms`, 'success');
      return true;
    } else {
      log(`Página ${url} respondeu com status inesperado: ${status}`, 'warning');
      return false;
    }
  } catch (error) {
    log(`Erro ao acessar ${url}: ${error.message}`, 'error');
    return false;
  }
}

// Função principal
async function runHealthCheck() {
  log('Iniciando verificação de saúde da aplicação...', 'info');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const page of PAGES_TO_CHECK) {
    const result = await checkPage(page);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }
  }
  
  log('Verificação de saúde concluída', 'info');
  log(`Páginas OK: ${successCount} / Páginas com erro: ${failureCount}`, 'info');
  
  if (failureCount === 0) {
    log('SAÚDE DA APLICAÇÃO: ÓTIMA - Todas as páginas estão funcionando!', 'success');
  } else if (failureCount <= 2) {
    log('SAÚDE DA APLICAÇÃO: REGULAR - Algumas páginas estão com problemas', 'warning');
  } else {
    log('SAÚDE DA APLICAÇÃO: CRÍTICA - Muitas páginas não estão respondendo corretamente!', 'error');
  }
}

// Executar verificação
runHealthCheck().catch(console.error); 