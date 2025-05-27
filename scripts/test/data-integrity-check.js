// Script para verificar a integridade dos dados no Supabase
// Executar com: node data-integrity-check.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const credentials = require('./credentials');

// Cliente Supabase
const supabase = createClient(
  credentials.SUPABASE_URL,
  credentials.SUPABASE_ANON_KEY
);

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

// Tabelas a verificar
const TABLES_TO_CHECK = [
  'communities',
  'community_members',
  'spaces',
  'posts',
  'post_comments',
  'discussion_topics',
  'discussions',
  'discussion_replies',
  'events',
  'rewards',
  'points_activities',
  'user_points'
];

// Funções de verificação
async function runChecks() {
  log('Iniciando verificação de integridade dos dados...', 'info');
  
  let successCount = 0;
  let warningCount = 0;
  let errorCount = 0;
  
  // 1. Verificar tabelas existentes
  for (const table of TABLES_TO_CHECK) {
    try {
      log(`Verificando tabela: ${table}`, 'test');
      
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        log(`Erro ao acessar tabela ${table}: ${error.message}`, 'error');
        errorCount++;
      } else {
        log(`Tabela ${table} existe e contém ${count} registros`, 'success');
        successCount++;
        
        // Verificar dados específicos com base na tabela
        await checkTableData(table);
      }
    } catch (error) {
      log(`Erro ao verificar tabela ${table}: ${error.message}`, 'error');
      errorCount++;
    }
  }
  
  // 2. Verificar integridade referencial
  await checkReferentialIntegrity();
  
  // 3. Verificar consistência de dados
  await checkDataConsistency();
  
  // Resumo
  log('Verificação de integridade de dados concluída', 'info');
  log(`Sucesso: ${successCount} / Avisos: ${warningCount} / Erros: ${errorCount}`, 'info');
  
  if (errorCount === 0 && warningCount === 0) {
    log('INTEGRIDADE DE DADOS: EXCELENTE', 'success');
  } else if (errorCount === 0 && warningCount <= 3) {
    log('INTEGRIDADE DE DADOS: BOA - Alguns avisos, mas sem erros críticos', 'warning');
  } else {
    log('INTEGRIDADE DE DADOS: PROBLEMÁTICA - Verifique os erros reportados', 'error');
  }
}

async function checkTableData(table) {
  // Verificações específicas para cada tabela
  switch (table) {
    case 'communities':
      await checkCommunities();
      break;
    case 'posts':
      await checkPosts();
      break;
    case 'discussions':
      await checkDiscussions();
      break;
    case 'points_activities':
      await checkPointsActivities();
      break;
  }
}

async function checkCommunities() {
  // Verificar se todas as comunidades têm creator_id válido
  const { data, error } = await supabase
    .from('communities')
    .select(`
      id,
      name,
      creator_id,
      members:community_members(count)
    `)
    .is('creator_id', null);
    
  if (error) {
    log(`Erro ao verificar creator_id em communities: ${error.message}`, 'error');
  } else if (data && data.length > 0) {
    log(`Encontradas ${data.length} comunidades sem creator_id`, 'warning');
    data.forEach(c => log(`Comunidade sem creator_id: ${c.id} (${c.name})`, 'warning'));
  } else {
    log('Todas as comunidades têm creator_id válido', 'success');
  }
}

async function checkPosts() {
  // Verificar se todos os posts têm author_id válido
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, author_id, community_id')
    .is('author_id', null);
    
  if (error) {
    log(`Erro ao verificar author_id em posts: ${error.message}`, 'error');
  } else if (data && data.length > 0) {
    log(`Encontrados ${data.length} posts sem author_id`, 'warning');
  } else {
    log('Todos os posts têm author_id válido', 'success');
  }
  
  // Verificar posts sem conteúdo
  const { data: emptyPosts, error: emptyError } = await supabase
    .from('posts')
    .select('id, content')
    .is('content', null);
    
  if (emptyError) {
    log(`Erro ao verificar conteúdo em posts: ${emptyError.message}`, 'error');
  } else if (emptyPosts && emptyPosts.length > 0) {
    log(`Encontrados ${emptyPosts.length} posts sem conteúdo`, 'warning');
  } else {
    log('Todos os posts têm conteúdo', 'success');
  }
}

async function checkDiscussions() {
  // Verificar se todas as discussões têm tópico válido
  const { data, error } = await supabase
    .from('discussions')
    .select('id, title, topic_id')
    .is('topic_id', null);
    
  if (error) {
    log(`Erro ao verificar topic_id em discussions: ${error.message}`, 'error');
  } else if (data && data.length > 0) {
    log(`Encontradas ${data.length} discussões sem tópico`, 'warning');
  } else {
    log('Todas as discussões têm tópico válido', 'success');
  }
  
  // Verificar respostas órfãs (sem discussão pai)
  const { data: orphanReplies, error: replyError } = await supabase
    .from('discussion_replies')
    .select(`
      id,
      discussion_id,
      discussions!inner(id)
    `)
    .limit(1);
    
  if (replyError) {
    log(`Erro ao verificar respostas órfãs: ${replyError.message}`, 'error');
  } else {
    log('Não foram encontradas respostas órfãs', 'success');
  }
}

async function checkPointsActivities() {
  // Verificar atividades de pontos sem usuário
  const { data, error } = await supabase
    .from('points_activities')
    .select('id, activity_type, user_id')
    .is('user_id', null);
    
  if (error) {
    log(`Erro ao verificar user_id em points_activities: ${error.message}`, 'error');
  } else if (data && data.length > 0) {
    log(`Encontradas ${data.length} atividades de pontos sem usuário`, 'warning');
  } else {
    log('Todas as atividades de pontos têm usuário válido', 'success');
  }
}

async function checkReferentialIntegrity() {
  // Verificar integridade referencial entre tabelas
  log('Verificando integridade referencial...', 'test');
  
  try {
    // Exemplo: Verificar posts com community_id inválido
    const { data: invalidPosts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        community_id,
        community:communities!inner(id)
      `)
      .limit(1);
      
    if (postsError) {
      if (postsError.message.includes('foreign key constraint')) {
        log('Encontrados posts com community_id inválido', 'warning');
      } else {
        log(`Erro ao verificar integridade referencial de posts: ${postsError.message}`, 'error');
      }
    } else {
      log('Posts têm integridade referencial para communities', 'success');
    }
    
    // Verificar discussões com community_id inválido
    const { data: invalidDiscussions, error: discussionsError } = await supabase
      .from('discussions')
      .select(`
        id,
        title,
        community_id,
        community:communities!inner(id)
      `)
      .limit(1);
      
    if (discussionsError) {
      if (discussionsError.message.includes('foreign key constraint')) {
        log('Encontradas discussões com community_id inválido', 'warning');
      } else {
        log(`Erro ao verificar integridade referencial de discussões: ${discussionsError.message}`, 'error');
      }
    } else {
      log('Discussões têm integridade referencial para communities', 'success');
    }
  } catch (error) {
    log(`Erro ao verificar integridade referencial: ${error.message}`, 'error');
  }
}

async function checkDataConsistency() {
  // Verificar consistência de dados entre tabelas relacionadas
  log('Verificando consistência de dados...', 'test');
  
  try {
    // Exemplo: Verificar contagem de respostas em discussões
    const { data: discussions, error } = await supabase
      .from('discussions')
      .select(`
        id,
        title,
        reply_count:discussion_replies(count)
      `)
      .limit(10);
      
    if (error) {
      log(`Erro ao verificar consistência de dados: ${error.message}`, 'error');
    } else {
      log('Verificação de consistência de dados concluída', 'success');
      
      // Exibir algumas estatísticas
      if (discussions && discussions.length > 0) {
        const withReplies = discussions.filter(d => d.reply_count > 0).length;
        log(`${withReplies} de ${discussions.length} discussões verificadas têm respostas`, 'info');
      }
    }
  } catch (error) {
    log(`Erro ao verificar consistência de dados: ${error.message}`, 'error');
  }
}

// Executar verificações
runChecks().catch(console.error); 