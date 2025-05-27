// Script para simular a jornada completa de um owner de comunidade
// Executar com: node owner-journey.js

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const credentials = require('./credentials');

// Cliente Supabase
const supabase = createClient(
  credentials.SUPABASE_URL,
  credentials.SUPABASE_ANON_KEY
);

// Configurações
const OWNER_EMAIL = 'owner@nortech.test';
const OWNER_PASSWORD = 'Owner123456!';
const BASE_URL = credentials.TEST_URL;

// Utilitário para log
const log = (message, type = 'info') => {
  const prefix = {
    info: '📘 INFO',
    success: '✅ SUCESSO',
    error: '❌ ERRO',
    warning: '⚠️ AVISO',
    test: '🧪 TESTE',
    step: '🔄 PASSO'
  }[type];
  
  console.log(`${prefix}: ${message}`);
};

// Função para capturar screenshot
const captureScreenshot = async (page, name) => {
  const screenshotPath = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotPath, `${name}.png`) });
  log(`Screenshot capturado: ${name}.png`, 'info');
};

// Funções de teste
async function runOwnerJourney() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Adiciona delay para visualização
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: 'videos/' }
  });
  const page = await context.newPage();
  
  try {
    log('Iniciando jornada do owner da comunidade...', 'test');
    
    // Criar usuário de teste como owner
    await createOwnerUser();
    
    // Login do owner
    await loginAsOwner(page);
    
    // Configurar comunidade
    await setupCommunity(page);
    
    // Configurar branding
    await setupBranding(page);
    
    // Criar post
    await createPost(page);
    
    // Criar evento
    await createEvent(page);
    
    // Criar tópico de discussão
    await createTopic(page);
    
    // Configurar recompensas e pontos
    await setupRewards(page);
    
    // Checar estatísticas da comunidade
    await checkStats(page);
    
    log('Jornada do owner concluída com sucesso!', 'success');
  } catch (error) {
    log(`Erro durante a jornada do owner: ${error.message}`, 'error');
    console.error(error);
    
    // Capturar screenshot em caso de erro
    await captureScreenshot(page, 'owner-error');
  } finally {
    await context.close();
    await browser.close();
  }
}

async function createOwnerUser() {
  log('Criando usuário owner...', 'step');
  
  try {
    // Verificar se o usuário já existe
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD
    });
    
    if (!signInError && signInData.user) {
      log(`Usuário owner já existe: ${signInData.user.id}`, 'success');
      return signInData.user;
    }
    
    // Criar usuário se não existir
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
      options: {
        data: {
          name: 'Owner Test',
          role: 'owner'
        }
      }
    });
    
    if (signUpError) throw signUpError;
    
    log(`Usuário owner criado com sucesso: ${signUpData.user.id}`, 'success');
    return signUpData.user;
  } catch (error) {
    log(`Falha ao criar usuário owner: ${error.message}`, 'error');
    throw error;
  }
}

async function loginAsOwner(page) {
  log('Fazendo login como owner...', 'step');
  
  try {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Preencher formulário de login
    await page.fill('input[type="email"]', OWNER_EMAIL);
    await page.fill('input[type="password"]', OWNER_PASSWORD);
    
    // Clicar no botão de login
    await page.click('button:has-text("Login")');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    await captureScreenshot(page, 'owner-login-success');
    
    log('Login como owner realizado com sucesso!', 'success');
  } catch (error) {
    log(`Falha no login como owner: ${error.message}`, 'error');
    throw error;
  }
}

async function setupCommunity(page) {
  log('Configurando comunidade...', 'step');
  
  try {
    // Navegar para as configurações da comunidade
    await page.goto(`${BASE_URL}/settings/community`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Community Settings")');
    
    // Preencher informações da comunidade
    await page.fill('input[placeholder*="Community name"]', 'Comunidade de Testes Automatizados');
    await page.fill('textarea[placeholder*="Describe your community"]', 'Esta é uma comunidade criada por testes automatizados para demonstração das funcionalidades do sistema.');
    
    // Configurar visibilidade
    await page.click('button:has-text("Visibility")');
    await page.click('button:has-text("Public")');
    
    // Salvar configurações
    await page.click('button:has-text("Save Changes")');
    
    // Aguardar confirmação
    await page.waitForSelector('div:has-text("Settings saved successfully")');
    await captureScreenshot(page, 'owner-community-settings');
    
    log('Configurações da comunidade salvas com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao configurar comunidade: ${error.message}`, 'error');
    throw error;
  }
}

async function setupBranding(page) {
  log('Configurando branding da comunidade...', 'step');
  
  try {
    // Navegar para as configurações de branding
    await page.goto(`${BASE_URL}/settings/branding`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Branding")');
    
    // Selecionar cores da marca
    await page.click('button:has-text("Primary Color")');
    await page.fill('input[type="text"][value="#6E56CF"]', '#4a6cf7');
    await page.click('button:has-text("Apply")');
    
    await page.click('button:has-text("Secondary Color")');
    await page.fill('input[type="text"][value="#6E56CF"]', '#f74a6c');
    await page.click('button:has-text("Apply")');
    
    // Salvar configurações
    await page.click('button:has-text("Save Changes")');
    
    // Aguardar confirmação
    await page.waitForSelector('div:has-text("Branding settings saved")');
    await captureScreenshot(page, 'owner-branding-settings');
    
    log('Configurações de branding salvas com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao configurar branding: ${error.message}`, 'error');
    throw error;
  }
}

async function createPost(page) {
  log('Criando post na comunidade...', 'step');
  
  try {
    // Navegar para a página de feed
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Feed")');
    
    // Clicar no botão para criar post
    await page.click('button:has-text("Create post")');
    
    // Aguardar abertura do modal
    await page.waitForSelector('div[role="dialog"]:has-text("Create post")');
    
    // Preencher informações do post
    await page.fill('input[placeholder="Title (optional)"]', 'Boas-vindas à nossa comunidade!');
    await page.fill('textarea[placeholder="Write something..."]', 'Olá a todos! Este é o primeiro post da nossa comunidade. Sintam-se à vontade para participar, comentar e compartilhar conhecimento.\n\nEstamos planejando muitos eventos e conteúdos interessantes!');
    
    // Adicionar mídia (simulação)
    if (await page.isVisible('button:has-text("Add media")')) {
      await page.click('button:has-text("Add media")');
      // Simulação de upload de arquivo
      log('Upload de mídia simulado', 'info');
    }
    
    // Publicar o post
    await page.click('button:has-text("Publish")');
    
    // Aguardar confirmação
    await page.waitForSelector('div:has-text("Post Published")');
    await captureScreenshot(page, 'owner-post-created');
    
    log('Post criado com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao criar post: ${error.message}`, 'error');
    throw error;
  }
}

async function createEvent(page) {
  log('Criando evento na comunidade...', 'step');
  
  try {
    // Navegar para a página de eventos
    await page.goto(`${BASE_URL}/events`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Events")');
    
    // Clicar no botão para criar evento
    await page.click('button:has-text("Create Event")');
    
    // Aguardar abertura do modal
    await page.waitForSelector('div[role="dialog"]:has-text("Create Event")');
    
    // Preencher informações do evento
    await page.fill('input[placeholder="Event title"]', 'Workshop de Introdução');
    await page.fill('textarea[placeholder="Event description"]', 'Neste workshop, vamos introduzir os principais conceitos da nossa plataforma e mostrar como aproveitar ao máximo os recursos disponíveis.');
    
    // Selecionar tipo de evento
    await page.click('button:has-text("Event Type")');
    await page.click('button:has-text("Workshop")');
    
    // Configurar data e hora
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', formattedDate);
    await page.fill('input[type="time"]', '14:00');
    
    // Configurar local
    await page.click('button:has-text("Location Type")');
    await page.click('button:has-text("Online")');
    await page.fill('input[placeholder="Meeting link or location details"]', 'https://meet.google.com/abc-defg-hij');
    
    // Configurar capacidade
    await page.fill('input[placeholder="Maximum attendees"]', '50');
    
    // Publicar o evento
    await page.click('button:has-text("Create Event")');
    
    // Aguardar confirmação
    await page.waitForSelector('div:has-text("Event Created")');
    await captureScreenshot(page, 'owner-event-created');
    
    log('Evento criado com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao criar evento: ${error.message}`, 'error');
    throw error;
  }
}

async function createTopic(page) {
  log('Criando tópico de discussão...', 'step');
  
  try {
    // Navegar para a página de discussões
    await page.goto(`${BASE_URL}/discussions`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Discussion Forums")');
    
    // Clicar no botão para criar tópico
    await page.click('button:has-text("New Topic")');
    
    // Aguardar abertura do modal
    await page.waitForSelector('div[role="dialog"]:has-text("Create Discussion Topic")');
    
    // Preencher informações do tópico
    await page.fill('input[placeholder*="General Discussion"]', 'Perguntas & Respostas');
    await page.fill('textarea[placeholder="Describe what this topic is about..."]', 'Espaço para perguntas e respostas sobre nossa plataforma, tecnologias e projetos.');
    
    // Selecionar ícone
    if (await page.isVisible('button:has-text("Select Icon")')) {
      await page.click('button:has-text("Select Icon")');
      await page.click('button[aria-label="Help Circle"]');
    }
    
    // Criar o tópico
    await page.click('button:has-text("Create Topic")');
    
    // Aguardar confirmação
    await page.waitForSelector('div:has-text("Topic Created")');
    await captureScreenshot(page, 'owner-topic-created');
    
    // Criar uma discussão dentro do tópico
    await page.click('text=Perguntas & Respostas');
    await page.waitForURL('**/discussions/**');
    
    await page.click('button:has-text("New Discussion")');
    await page.waitForSelector('div[role="dialog"]:has-text("New Discussion")');
    
    await page.fill('input[placeholder="Enter a title for your discussion"]', 'Como começar a contribuir?');
    await page.fill('textarea[placeholder="Enter your discussion content here..."]', 'Olá a todos!\n\nGostaria de compartilhar dicas sobre como novos membros podem começar a contribuir com projetos na nossa comunidade. Quais são os primeiros passos recomendados?');
    
    await page.click('button:has-text("Create Discussion")');
    await page.waitForSelector('div:has-text("Discussion Created")');
    
    await captureScreenshot(page, 'owner-discussion-created');
    
    log('Tópico e discussão criados com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao criar tópico/discussão: ${error.message}`, 'error');
    throw error;
  }
}

async function setupRewards(page) {
  log('Configurando sistema de recompensas e pontos...', 'step');
  
  try {
    // Navegar para configurações de pontos
    await page.goto(`${BASE_URL}/settings/points`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se estamos na página correta
    await page.waitForSelector('h1:has-text("Points & Rewards")');
    
    // Configurar pontos para ações
    await page.fill('input[placeholder="2"]:near(:text("Daily Login"))', '3');
    await page.fill('input[placeholder="3"]:near(:text("Comment"))', '5');
    await page.fill('input[placeholder="1"]:near(:text("Like"))', '2');
    
    // Salvar configurações
    await page.click('button:has-text("Save Changes")');
    await page.waitForSelector('div:has-text("Points settings saved")');
    
    // Navegar para loja de recompensas
    await page.goto(`${BASE_URL}/settings/rewards`);
    await page.waitForLoadState('networkidle');
    
    // Adicionar uma recompensa
    await page.click('button:has-text("Add Reward")');
    await page.waitForSelector('div[role="dialog"]:has-text("Add Reward")');
    
    await page.fill('input[placeholder="Reward Title"]', 'Mentoria Individual');
    await page.fill('textarea[placeholder="Reward Description"]', 'Sessão de mentoria individual de 30 minutos com um dos líderes da comunidade.');
    await page.fill('input[placeholder="100"]:near(:text("Points Cost"))', '500');
    await page.fill('input[placeholder="10"]:near(:text("Quantity Available"))', '5');
    
    // Salvar recompensa
    await page.click('button:has-text("Save Reward")');
    await page.waitForSelector('div:has-text("Reward Added")');
    
    await captureScreenshot(page, 'owner-rewards-setup');
    
    log('Sistema de recompensas configurado com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao configurar recompensas: ${error.message}`, 'error');
    throw error;
  }
}

async function checkStats(page) {
  log('Verificando estatísticas da comunidade...', 'step');
  
  try {
    // Navegar para o dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verificar estatísticas
    await page.waitForSelector('div:has-text("Community Overview")');
    
    // Capturar screenshot do dashboard
    await captureScreenshot(page, 'owner-dashboard-stats');
    
    log('Estatísticas da comunidade verificadas com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao verificar estatísticas: ${error.message}`, 'error');
    throw error;
  }
}

// Executar teste
if (require.main === module) {
  runOwnerJourney().catch(console.error);
}

module.exports = {
  runOwnerJourney
}; 