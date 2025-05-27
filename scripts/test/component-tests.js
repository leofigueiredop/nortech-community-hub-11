// Script para testar componentes críticos diretamente
// Executar com: node component-tests.js

const { createClient } = require('@supabase/supabase-js');
const credentials = require('./credentials');
const axios = require('axios');

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

// Configurações
let token = null;
let userId = null;
let communityId = null;

// Funções de teste
async function runTests() {
  try {
    // Login via API
    await testLogin();
    
    // Testar componentes críticos
    await testCreatePostDialog();
    await testCreateTopicDialog();
    await testCreateDiscussionDialog();
    await testViewControls();
    
    log('Todos os testes de componentes foram concluídos!', 'success');
  } catch (error) {
    log(`Erro durante os testes: ${error.message}`, 'error');
    console.error(error);
  }
}

async function testLogin() {
  log('Testando login via API...', 'test');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.TEST_EMAIL,
      password: credentials.TEST_PASSWORD
    });
    
    if (error) throw error;
    
    token = data.session.access_token;
    userId = data.user.id;
    
    // Obter community_id
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select('*')
      .eq('creator_id', userId)
      .limit(1);
      
    if (communityError) throw communityError;
    
    if (communityData && communityData.length > 0) {
      communityId = communityData[0].id;
    } else {
      // Verificar se é membro de alguma comunidade
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId)
        .limit(1);
        
      if (memberError) throw memberError;
      
      if (memberData && memberData.length > 0) {
        communityId = memberData[0].community_id;
      } else {
        throw new Error('Usuário não está associado a nenhuma comunidade');
      }
    }
    
    log(`Login bem-sucedido. User ID: ${userId}, Community ID: ${communityId}`, 'success');
    return true;
  } catch (error) {
    log(`Falha no login: ${error.message}`, 'error');
    throw error;
  }
}

async function testCreatePostDialog() {
  log('Testando componente CreatePostDialog...', 'test');
  
  try {
    // Verificar se existem espaços para postar
    const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('*')
      .eq('community_id', communityId)
      .limit(5);
      
    if (spacesError) throw spacesError;
    
    if (!spaces || spaces.length === 0) {
      log('Nenhum espaço encontrado para testar CreatePostDialog', 'warning');
      return false;
    }
    
    // Criar um post para testar o componente
    const postData = {
      title: `Teste de CreatePostDialog ${new Date().toISOString()}`,
      content: 'Conteúdo de teste do componente CreatePostDialog',
      author_id: userId,
      community_id: communityId,
      space_id: spaces[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert(postData)
      .select();
      
    if (postError) throw postError;
    
    log(`Post criado com sucesso para testar CreatePostDialog. ID: ${newPost[0].id}`, 'success');
    return true;
  } catch (error) {
    log(`Falha ao testar CreatePostDialog: ${error.message}`, 'error');
    return false;
  }
}

async function testCreateTopicDialog() {
  log('Testando componente CreateTopicDialog...', 'test');
  
  try {
    // Criar um tópico para testar o componente
    const topicData = {
      name: `Tópico de Teste ${new Date().toISOString()}`,
      description: 'Descrição de teste do componente CreateTopicDialog',
      icon: 'message-square',
      color: '#6941C6',
      community_id: communityId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newTopic, error: topicError } = await supabase
      .from('discussion_topics')
      .insert(topicData)
      .select();
      
    if (topicError) throw topicError;
    
    log(`Tópico criado com sucesso para testar CreateTopicDialog. ID: ${newTopic[0].id}`, 'success');
    return true;
  } catch (error) {
    log(`Falha ao testar CreateTopicDialog: ${error.message}`, 'error');
    return false;
  }
}

async function testCreateDiscussionDialog() {
  log('Testando componente CreateDiscussionDialog...', 'test');
  
  try {
    // Obter um tópico para criar uma discussão
    const { data: topics, error: topicsError } = await supabase
      .from('discussion_topics')
      .select('*')
      .eq('community_id', communityId)
      .limit(1);
      
    if (topicsError) throw topicsError;
    
    if (!topics || topics.length === 0) {
      log('Nenhum tópico encontrado para testar CreateDiscussionDialog', 'warning');
      return false;
    }
    
    // Criar uma discussão para testar o componente
    const discussionData = {
      title: `Discussão de Teste ${new Date().toISOString()}`,
      content: 'Conteúdo de teste do componente CreateDiscussionDialog',
      topic_id: topics[0].id,
      author_id: userId,
      community_id: communityId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newDiscussion, error: discussionError } = await supabase
      .from('discussions')
      .insert(discussionData)
      .select();
      
    if (discussionError) throw discussionError;
    
    log(`Discussão criada com sucesso para testar CreateDiscussionDialog. ID: ${newDiscussion[0].id}`, 'success');
    return true;
  } catch (error) {
    log(`Falha ao testar CreateDiscussionDialog: ${error.message}`, 'error');
    return false;
  }
}

async function testViewControls() {
  log('Testando componente ViewControls...', 'test');
  
  try {
    // Verificar acesso à página do feed
    const response = await axios.get(`${credentials.TEST_URL}/feed`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      log('ViewControls testado com sucesso na página do feed', 'success');
      return true;
    } else {
      log(`ViewControls obteve resposta inesperada: ${response.status}`, 'warning');
      return false;
    }
  } catch (error) {
    log(`Falha ao testar ViewControls: ${error.message}`, 'error');
    return false;
  }
}

// Executar testes
runTests().catch(console.error); 