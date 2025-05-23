// Script para testar a interface do usuário usando Playwright
// Executar com: node ui-tests.js

const { chromium } = require('playwright');
require('dotenv').config();
const credentials = require('./credentials');

// Configurações
const TEST_EMAIL = credentials.TEST_EMAIL;
const TEST_PASSWORD = credentials.TEST_PASSWORD;
const BASE_URL = credentials.TEST_URL;

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

// Funções de teste
async function runTests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  try {
    log('Iniciando testes de UI...', 'test');
    
    // Testar login
    await testLogin(page);
    
    // Testar criação de post
    await testCreatePost(page);
    
    // Testar discussões
    await testDiscussions(page);
    
    log('Todos os testes UI foram concluídos!', 'success');
  } catch (error) {
    log(`Erro durante os testes UI: ${error.message}`, 'error');
    console.error(error);
    
    // Capturar screenshot em caso de erro
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
}

async function testLogin(page) {
  log('Testando login via UI...', 'test');
  
  try {
    // Navegar para a página de login
    await page.goto(`${BASE_URL}/login`);
    
    // Preencher campos de login
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // Clicar no botão de login
    await page.click('button:has-text("Login")');
    
    // Aguardar redirecionamento para o dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    log('Login via UI realizado com sucesso!', 'success');
    return true;
  } catch (error) {
    log(`Falha no login via UI: ${error.message}`, 'error');
    throw error;
  }
}

async function testCreatePost(page) {
  log('Testando criação de post via UI...', 'test');
  
  try {
    // Navegar para a página do Feed
    await page.goto(`${BASE_URL}/feed`);
    
    // Aguardar carregamento da página
    await page.waitForSelector('h1:has-text("Feed")');
    
    // Clicar no botão "Create post"
    await page.click('button:has-text("Create post")');
    
    // Aguardar abertura do modal
    await page.waitForSelector('div[role="dialog"]:has-text("Create post")');
    
    // Preencher campos do post
    await page.fill('input[placeholder="Title (optional)"]', 'Teste UI Automatizado');
    await page.fill('textarea[placeholder="Write something..."]', 'Conteúdo de teste criado via automação de UI em ' + new Date().toISOString());
    
    // Publicar o post
    await page.click('button:has-text("Publish")');
    
    // Aguardar toast de sucesso
    await page.waitForSelector('div:has-text("Post Published")');
    
    log('Post criado via UI com sucesso!', 'success');
    return true;
  } catch (error) {
    log(`Falha ao criar post via UI: ${error.message}`, 'error');
    throw error;
  }
}

async function testDiscussions(page) {
  log('Testando criação de tópico e discussão via UI...', 'test');
  
  try {
    // Navegar para a página de discussões
    await page.goto(`${BASE_URL}/discussions`);
    
    // Aguardar carregamento da página
    await page.waitForSelector('h1:has-text("Discussion Forums")');
    
    // Testar criação de tópico
    const topicName = `Tópico UI Test ${new Date().getTime()}`;
    await createTopic(page, topicName);
    
    // Clicar no tópico recém-criado
    await page.click(`text=${topicName}`);
    
    // Testar criação de discussão no tópico
    await createDiscussion(page);
    
    log('Testes de discussões via UI concluídos com sucesso!', 'success');
    return true;
  } catch (error) {
    log(`Falha nos testes de discussões via UI: ${error.message}`, 'error');
    throw error;
  }
}

async function createTopic(page, topicName) {
  // Clicar no botão "New Topic"
  await page.click('button:has-text("New Topic")');
  
  // Aguardar abertura do modal
  await page.waitForSelector('div[role="dialog"]:has-text("Create Discussion Topic")');
  
  // Preencher campos do tópico
  await page.fill('input[placeholder*="General Discussion"]', topicName);
  await page.fill('textarea[placeholder="Describe what this topic is about..."]', 'Descrição do tópico criado via automação de UI');
  
  // Criar o tópico
  await page.click('button:has-text("Create Topic")');
  
  // Aguardar toast de sucesso
  await page.waitForSelector('div:has-text("Topic Created")');
  
  log(`Tópico "${topicName}" criado via UI com sucesso!`, 'success');
}

async function createDiscussion(page) {
  // Clicar no botão "New Discussion"
  await page.click('button:has-text("New Discussion")');
  
  // Aguardar abertura do modal
  await page.waitForSelector('div[role="dialog"]:has-text("New Discussion")');
  
  // Preencher campos da discussão
  const discussionTitle = `Discussão UI Test ${new Date().getTime()}`;
  await page.fill('input[placeholder="Enter a title for your discussion"]', discussionTitle);
  await page.fill('textarea[placeholder="Enter your discussion content here..."]', 'Conteúdo da discussão criada via automação de UI em ' + new Date().toISOString());
  
  // Criar a discussão
  await page.click('button:has-text("Create Discussion")');
  
  // Aguardar toast de sucesso
  await page.waitForSelector('div:has-text("Discussion Created")');
  
  log(`Discussão "${discussionTitle}" criada via UI com sucesso!`, 'success');
}

// Executar testes
runTests().catch(console.error); 