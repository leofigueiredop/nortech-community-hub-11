// Script para testar funcionalidades do sistema (posts, discussões, tópicos, anexos)
// Executar com: node scripts/test/functional-tests.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const credentials = require('./credentials');

// Cliente Supabase
const supabase = createClient(
  credentials.SUPABASE_URL,
  credentials.SUPABASE_ANON_KEY
);

// Configurações
const TEST_EMAIL = credentials.TEST_EMAIL;
const TEST_PASSWORD = credentials.TEST_PASSWORD;
let currentUser = null;
let community = null;

// Utility para log
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
  try {
    await testLogin();
    await testCreatePost();
    await testCreateTopic();
    await testCreateDiscussion();
    
    log('Todos os testes foram concluídos!', 'success');
  } catch (error) {
    log(`Erro durante os testes: ${error.message}`, 'error');
    console.error(error);
  }
}

async function testLogin() {
  log('Testando login...', 'test');
  
  try {
    // Login com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (error) throw error;
    
    currentUser = data.user;
    log(`Login realizado com sucesso! User ID: ${currentUser.id}`, 'success');
    
    // Buscar comunidade do usuário
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select('*')
      .eq('creator_id', currentUser.id)
      .single();
      
    if ((!communityData || communityError) && communityError.code !== 'PGRST116') {
      // Verificar se é membro de alguma comunidade
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', currentUser.id)
        .eq('status', 'active')
        .single();
        
      if (!memberData || memberError) {
        log('Usuário não tem comunidade associada. Criando uma nova...', 'warning');
        
        // Criar comunidade para testes
        const { data: newCommunity, error: createError } = await supabase
          .from('communities')
          .insert({
            name: 'Comunidade de Teste',
            description: 'Comunidade para testes automatizados',
            creator_id: currentUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active'
          })
          .select()
          .single();
          
        if (createError) throw createError;
        community = newCommunity;
        
        // Adicionar usuário como membro
        await supabase
          .from('community_members')
          .insert({
            community_id: community.id,
            user_id: currentUser.id,
            role: 'owner',
            status: 'active',
            joined_at: new Date().toISOString()
          });
        
        log(`Nova comunidade criada: ${community.name}`, 'success');
      } else {
        // Buscar dados da comunidade
        const { data: commData } = await supabase
          .from('communities')
          .select('*')
          .eq('id', memberData.community_id)
          .single();
          
        community = commData;
        log(`Comunidade encontrada: ${community.name}`, 'success');
      }
    } else if (communityData) {
      community = communityData;
      log(`Comunidade encontrada: ${community.name}`, 'success');
    } else {
      // Nenhuma comunidade encontrada, criar uma nova
      log('Nenhuma comunidade encontrada. Criando uma nova...', 'warning');
      
      // Criar comunidade para testes
      const { data: newCommunity, error: createError } = await supabase
        .from('communities')
        .insert({
          name: 'Comunidade de Teste',
          description: 'Comunidade para testes automatizados',
          creator_id: currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();
        
      if (createError) throw createError;
      community = newCommunity;
      
      // Adicionar usuário como membro
      await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: currentUser.id,
          role: 'owner',
          status: 'active',
          joined_at: new Date().toISOString()
        });
      
      log(`Nova comunidade criada: ${community.name}`, 'success');
    }
    
    return true;
  } catch (error) {
    log(`Falha no login: ${error.message}`, 'error');
    throw error;
  }
}

async function testCreatePost() {
  log('Testando criação de post...', 'test');
  
  try {
    // Criar um post
    const postContent = `Teste automatizado: ${new Date().toISOString()}`;
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        content: postContent,
        author_id: currentUser.id,
        community_id: community.id,
        media_urls: [],
        visibility: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (postError) throw postError;
    
    log(`Post criado com sucesso! ID: ${post[0].id}`, 'success');
    return post[0];
  } catch (error) {
    log(`Falha ao criar post: ${error.message}`, 'error');
    throw error;
  }
}

async function testCreateTopic() {
  log('Testando criação de tópico de discussão...', 'test');
  
  try {
    // Criar um tópico
    const { data: topic, error: topicError } = await supabase
      .from('discussion_topics')
      .insert({
        name: `Tópico de Teste ${new Date().getTime()}`,
        description: 'Tópico para testes automatizados',
        icon: 'message-square',
        community_id: community.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (topicError) throw topicError;
    
    log(`Tópico criado com sucesso! ID: ${topic[0].id}`, 'success');
    return topic[0];
  } catch (error) {
    log(`Falha ao criar tópico: ${error.message}`, 'error');
    throw error;
  }
}

async function testCreateDiscussion() {
  log('Testando criação de discussão...', 'test');
  
  try {
    // Buscar um tópico existente
    const { data: topics, error: topicsError } = await supabase
      .from('discussion_topics')
      .select('*')
      .eq('community_id', community.id)
      .limit(1);
      
    if (topicsError) throw topicsError;
    
    if (!topics || topics.length === 0) {
      throw new Error('Nenhum tópico encontrado para criar discussão');
    }
    
    const topic = topics[0];
    
    // Criar uma discussão
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .insert({
        title: `Discussão de Teste ${new Date().getTime()}`,
        content: 'Conteúdo para teste automatizado de discussão',
        topic_id: topic.id,
        author_id: currentUser.id,
        community_id: community.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_closed: false,
        is_pinned: false,
        view_count: 0
      })
      .select();
      
    if (discussionError) throw discussionError;
    
    log(`Discussão criada com sucesso! ID: ${discussion[0].id}`, 'success');
    
    // Testar criação de resposta
    const { data: reply, error: replyError } = await supabase
      .from('discussion_replies')
      .insert({
        content: 'Resposta de teste automatizado',
        discussion_id: discussion[0].id,
        author_id: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_solution: false
      })
      .select();
      
    if (replyError) throw replyError;
    
    log(`Resposta criada com sucesso! ID: ${reply[0].id}`, 'success');
    return discussion[0];
  } catch (error) {
    log(`Falha ao criar discussão: ${error.message}`, 'error');
    throw error;
  }
}

// Executar testes
runTests().catch(console.error); 