// Script para simular a jornada completa de um usuário regular da comunidade
// Executar com: node user-journey.js

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const credentials = require('./credentials');
const { runOwnerJourney } = require('./owner-journey');

// Cliente Supabase
const supabase = createClient(
  credentials.SUPABASE_URL,
  credentials.SUPABASE_ANON_KEY
);

// Configurações
const USER_EMAIL = 'member@nortech.test';
const USER_PASSWORD = 'Member123456!';
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
async function runUserJourney(skipOwnerJourney = false) {
  // Verificar se deve executar a jornada do owner primeiro
  if (!skipOwnerJourney) {
    log('Executando jornada do owner para preparar conteúdo...', 'info');
    await runOwnerJourney().catch(error => {
      log(`Erro na jornada do owner, continuando com a jornada do usuário: ${error.message}`, 'warning');
    });
  }
  
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
    log('Iniciando jornada do usuário regular da comunidade...', 'test');
    
    // Criar usuário de teste como membro
    await createMemberUser();
    
    // Login do usuário
    await loginAsMember(page);
    
    // Explorar comunidade
    await exploreCommunity(page);
    
    // Interagir com post
    await interactWithPost(page);
    
    // Participar de discussão
    await participateInDiscussion(page);
    
    // Registrar-se em evento
    await registerForEvent(page);
    
    // Ver pontuação e recompensas
    await checkPointsAndRewards(page);
    
    // Modificar perfil
    await updateProfile(page);
    
    log('Jornada do usuário concluída com sucesso!', 'success');
  } catch (error) {
    log(`Erro durante a jornada do usuário: ${error.message}`, 'error');
    console.error(error);
    
    // Capturar screenshot em caso de erro
    await captureScreenshot(page, 'user-error');
  } finally {
    await context.close();
    await browser.close();
  }
}

async function createMemberUser() {
  log('Criando usuário membro...', 'step');
  
  try {
    // Verificar se o usuário já existe
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    
    if (!signInError && signInData.user) {
      log(`Usuário membro já existe: ${signInData.user.id}`, 'success');
      return signInData.user;
    }
    
    // Criar usuário se não existir
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: USER_EMAIL,
      password: USER_PASSWORD,
      options: {
        data: {
          name: 'Membro Teste',
          role: 'member'
        }
      }
    });
    
    if (signUpError) throw signUpError;
    
    log(`Usuário membro criado com sucesso: ${signUpData.user.id}`, 'success');
    
    // Buscar comunidade para juntar-se
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
      
    if (communitiesError) throw communitiesError;
    
    if (communities && communities.length > 0) {
      // Adicionar como membro da comunidade
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: communities[0].id,
          user_id: signUpData.user.id,
          role: 'member',
          status: 'active',
          joined_at: new Date().toISOString()
        });
        
      if (memberError) throw memberError;
      
      log(`Usuário adicionado à comunidade: ${communities[0].name}`, 'success');
    }
    
    return signUpData.user;
  } catch (error) {
    log(`Falha ao criar usuário membro: ${error.message}`, 'error');
    throw error;
  }
}

async function loginAsMember(page) {
  log('Fazendo login como membro...', 'step');
  
  try {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Preencher formulário de login
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    
    // Clicar no botão de login
    await page.click('button:has-text("Login")');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    await captureScreenshot(page, 'user-login-success');
    
    log('Login como membro realizado com sucesso!', 'success');
  } catch (error) {
    log(`Falha no login como membro: ${error.message}`, 'error');
    throw error;
  }
}

async function exploreCommunity(page) {
  log('Explorando a comunidade...', 'step');
  
  try {
    // Visitar diferentes seções da comunidade
    const sections = [
      { url: '/dashboard', name: 'Dashboard' },
      { url: '/feed', name: 'Feed' },
      { url: '/events', name: 'Eventos' },
      { url: '/discussions', name: 'Fóruns de Discussão' },
      { url: '/library', name: 'Biblioteca' },
      { url: '/store', name: 'Loja de Recompensas' }
    ];
    
    for (const section of sections) {
      await page.goto(`${BASE_URL}${section.url}`);
      await page.waitForLoadState('networkidle');
      await captureScreenshot(page, `user-visit-${section.url.replace('/', '')}`);
      log(`Visitou a seção ${section.name}`, 'info');
      
      // Pequena pausa para visibilidade
      await page.waitForTimeout(1000);
    }
    
    log('Exploração da comunidade concluída com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao explorar comunidade: ${error.message}`, 'error');
    throw error;
  }
}

async function interactWithPost(page) {
  log('Interagindo com posts...', 'step');
  
  try {
    // Navegar para o feed
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento dos posts
    await page.waitForSelector('div[role="article"]', { timeout: 10000 }).catch(() => {
      log('Nenhum post encontrado no feed', 'warning');
    });
    
    // Verificar se existem posts
    const postElements = await page.$$('div[role="article"]');
    
    if (postElements.length === 0) {
      log('Nenhum post disponível para interação', 'warning');
      return;
    }
    
    // Curtir o primeiro post
    const likeButton = await postElements[0].$('button[aria-label="Like"]') || 
                       await postElements[0].$('button:has-text("Like")') ||
                       await postElements[0].$('button:has-text("👍")');
    
    if (likeButton) {
      await likeButton.click();
      log('Curtiu um post', 'success');
    }
    
    // Comentar no post
    const commentButton = await postElements[0].$('button[aria-label="Comment"]') || 
                          await postElements[0].$('button:has-text("Comment")') ||
                          await postElements[0].$('button:has-text("💬")');
    
    if (commentButton) {
      await commentButton.click();
      
      // Aguardar área de comentário aparecer
      await page.waitForSelector('textarea[placeholder*="Write a comment"]');
      
      // Escrever comentário
      await page.fill('textarea[placeholder*="Write a comment"]', 'Excelente post! Estou muito animado para fazer parte desta comunidade e contribuir com o grupo.');
      
      // Enviar comentário
      await page.click('button:has-text("Post")');
      
      log('Comentou em um post', 'success');
    }
    
    await captureScreenshot(page, 'user-post-interaction');
    
    log('Interação com posts concluída com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao interagir com posts: ${error.message}`, 'error');
    throw error;
  }
}

async function participateInDiscussion(page) {
  log('Participando de discussão...', 'step');
  
  try {
    // Navegar para as discussões
    await page.goto(`${BASE_URL}/discussions`);
    await page.waitForLoadState('networkidle');
    
    // Procurar por um tópico
    const discussionTopics = await page.$$('a[href*="/discussions/"]');
    
    if (discussionTopics.length === 0) {
      log('Nenhum tópico de discussão encontrado', 'warning');
      return;
    }
    
    // Entrar no primeiro tópico
    await discussionTopics[0].click();
    await page.waitForLoadState('networkidle');
    
    // Verificar se há discussões
    const discussionElements = await page.$$('a[href*="/discussions/topic/"]');
    
    if (discussionElements.length === 0) {
      // Criar uma nova discussão
      await page.click('button:has-text("New Discussion")');
      await page.waitForSelector('div[role="dialog"]:has-text("New Discussion")');
      
      await page.fill('input[placeholder="Enter a title for your discussion"]', 'Dúvida sobre primeiros passos');
      await page.fill('textarea[placeholder="Enter your discussion content here..."]', 'Olá pessoal!\n\nSou novo na comunidade e gostaria de saber quais são os primeiros passos recomendados para quem está começando. Alguém pode compartilhar dicas ou materiais de estudo?\n\nObrigado!');
      
      await page.click('button:has-text("Create Discussion")');
      await page.waitForSelector('div:has-text("Discussion Created")');
      
      log('Nova discussão criada', 'success');
    } else {
      // Entrar em uma discussão existente
      await discussionElements[0].click();
      await page.waitForLoadState('networkidle');
      
      // Responder à discussão
      await page.click('button:has-text("Reply")');
      await page.waitForSelector('textarea[placeholder*="Write your reply"]');
      
      await page.fill('textarea[placeholder*="Write your reply"]', 'Obrigado por compartilhar essas informações! Achei muito útil e vou seguir essas dicas. Alguma recomendação específica de por onde começar?');
      
      await page.click('button:has-text("Post Reply")');
      
      log('Respondeu a uma discussão', 'success');
    }
    
    await captureScreenshot(page, 'user-discussion-participation');
    
    log('Participação em discussão concluída com sucesso!', 'success');
  } catch (error) {
    log(`Falha ao participar de discussão: ${error.message}`, 'error');
    throw error;
  }
}

async function registerForEvent(page) {
  log('Registrando-se em evento...', 'step');
  
  try {
    // Navegar para eventos
    await page.goto(`${BASE_URL}/events`);
    await page.waitForLoadState('networkidle');
    
    // Procurar eventos disponíveis
    const eventCards = await page.$$('div[class*="event-card"]');
    
    if (eventCards.length === 0) {
      log('Nenhum evento disponível para registro', 'warning');
      return;
    }
    
    // Clicar no primeiro evento
    await eventCards[0].click();
    await page.waitForLoadState('networkidle');
    
    // Registrar-se no evento
    const registerButton = await page.$('button:has-text("Register")') || 
                           await page.$('button:has-text("RSVP")') ||
                           await page.$('button:has-text("Attend")');
    
    if (registerButton) {
      await registerButton.click();
      await page.waitForSelector('div:has-text("Registration Confirmed")');
      
      log('Registrado no evento com sucesso', 'success');
    } else {
      log('Botão de registro não encontrado', 'warning');
    }
    
    await captureScreenshot(page, 'user-event-registration');
    
    log('Registro em evento concluído!', 'success');
  } catch (error) {
    log(`Falha ao registrar-se em evento: ${error.message}`, 'error');
    throw error;
  }
}

async function checkPointsAndRewards(page) {
  log('Verificando pontos e recompensas...', 'step');
  
  try {
    // Navegar para pontos
    await page.goto(`${BASE_URL}/points`);
    await page.waitForLoadState('networkidle');
    
    // Capturar screenshot da página de pontos
    await captureScreenshot(page, 'user-points');
    
    // Navegar para loja de recompensas
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    
    // Verificar recompensas disponíveis
    const rewardCards = await page.$$('div[class*="reward-card"]');
    
    if (rewardCards.length > 0) {
      // Clicar na primeira recompensa para ver detalhes
      await rewardCards[0].click();
      
      // Aguardar abertura do modal
      await page.waitForSelector('div[role="dialog"]').catch(() => {
        log('Modal de detalhes da recompensa não abriu', 'warning');
      });
      
      await captureScreenshot(page, 'user-reward-details');
      
      // Fechar modal (se existir)
      const closeButton = await page.$('button[aria-label="Close"]');
      if (closeButton) await closeButton.click();
    }
    
    await captureScreenshot(page, 'user-rewards-store');
    
    log('Verificação de pontos e recompensas concluída!', 'success');
  } catch (error) {
    log(`Falha ao verificar pontos e recompensas: ${error.message}`, 'error');
    throw error;
  }
}

async function updateProfile(page) {
  log('Atualizando perfil...', 'step');
  
  try {
    // Navegar para perfil
    await page.goto(`${BASE_URL}/profile`);
    await page.waitForLoadState('networkidle');
    
    // Clicar em editar perfil
    const editButton = await page.$('button:has-text("Edit Profile")');
    
    if (editButton) {
      await editButton.click();
      
      // Aguardar abertura do modal
      await page.waitForSelector('div[role="dialog"]:has-text("Edit Profile")');
      
      // Atualizar informações
      await page.fill('input[placeholder*="Display Name"]', 'Membro Teste Atualizado');
      await page.fill('textarea[placeholder*="Bio"]', 'Membro ativo da comunidade, interessado em tecnologia e desenvolvimento de software. Sempre buscando aprender e compartilhar conhecimento!');
      
      // Salvar alterações
      await page.click('button:has-text("Save")');
      
      // Aguardar confirmação
      await page.waitForSelector('div:has-text("Profile updated")');
      
      log('Perfil atualizado com sucesso', 'success');
    } else {
      log('Botão de editar perfil não encontrado', 'warning');
    }
    
    await captureScreenshot(page, 'user-profile-updated');
    
    log('Atualização de perfil concluída!', 'success');
  } catch (error) {
    log(`Falha ao atualizar perfil: ${error.message}`, 'error');
    throw error;
  }
}

// Executar teste
if (require.main === module) {
  runUserJourney().catch(console.error);
}

module.exports = {
  runUserJourney
}; 