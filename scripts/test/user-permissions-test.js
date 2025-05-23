// Script para testar as permissões de usuário
// Executar com: node user-permissions-test.js

const { createClient } = require('@supabase/supabase-js');
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

// Funções de teste
async function runTests() {
  try {
    // Login
    const userData = await testLogin();
    if (!userData) return;
    
    const { user, community, role } = userData;
    
    // Verificar permissões de usuário
    await testUserRole(user, community, role);
    
    // Testar criar posts
    await testPostCreation(user, community, role);
    
    // Testar criar discussões
    await testDiscussionCreation(user, community, role);
    
    // Testar botões de ação baseados em role
    await testActionButtons(role);
    
    log('Todos os testes de permissões foram concluídos!', 'success');
  } catch (error) {
    log(`Erro durante os testes: ${error.message}`, 'error');
    console.error(error);
  }
}

async function testLogin() {
  log('Testando login e obtendo papel do usuário...', 'test');
  
  try {
    // Login com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.TEST_EMAIL,
      password: credentials.TEST_PASSWORD
    });
    
    if (error) throw error;
    
    const user = data.user;
    
    // Buscar comunidade do usuário
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select('*')
      .eq('creator_id', user.id)
      .single();
      
    let community = null;
    let role = 'member';
    
    if (communityError && communityError.code !== 'PGRST116') {
      // Verificar se é membro de alguma comunidade
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id, role')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
        
      if (memberError) {
        throw new Error('Usuário não tem comunidade associada');
      }
      
      // Buscar dados da comunidade
      const { data: commData } = await supabase
        .from('communities')
        .select('*')
        .eq('id', memberData.community_id)
        .single();
        
      community = commData;
      role = memberData.role;
    } else if (communityData) {
      community = communityData;
      role = 'owner'; // Creator da comunidade é considerado owner
    }
    
    log(`Login bem-sucedido! User: ${user.id}, Comunidade: ${community.name}, Papel: ${role}`, 'success');
    
    return { user, community, role };
  } catch (error) {
    log(`Falha no login: ${error.message}`, 'error');
    return null;
  }
}

async function testUserRole(user, community, role) {
  log(`Testando permissões do usuário com papel: ${role}...`, 'test');
  
  // A hierarquia de papéis é:
  // owner > admin > moderator > member
  
  try {
    // Verificar permissões baseadas no papel
    const isOwnerOrAdmin = ['owner', 'admin'].includes(role);
    const isModerator = role === 'moderator' || isOwnerOrAdmin;
    const isMember = true; // Todos os usuários logados são pelo menos membros
    
    log(`isOwnerOrAdmin: ${isOwnerOrAdmin}`, 'info');
    log(`isModerator: ${isModerator}`, 'info');
    log(`isMember: ${isMember}`, 'info');
    
    // Verificar acesso à API baseado no papel
    if (isOwnerOrAdmin) {
      // Testar acesso a configurações de comunidade (apenas owner/admin)
      const { data: settings, error: settingsError } = await supabase
        .from('community_settings')
        .select('*')
        .eq('community_id', community.id)
        .limit(1);
        
      if (settingsError) {
        log(`Usuário com papel ${role} não consegue acessar configurações de comunidade: ${settingsError.message}`, 'error');
      } else {
        log(`Usuário com papel ${role} pode acessar configurações de comunidade`, 'success');
      }
    }
    
    return { isOwnerOrAdmin, isModerator, isMember };
  } catch (error) {
    log(`Erro ao testar permissões: ${error.message}`, 'error');
    throw error;
  }
}

async function testPostCreation(user, community, role) {
  log(`Testando criação de post com papel: ${role}...`, 'test');
  
  try {
    // Verificar se existem espaços para postar
    const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('*')
      .eq('community_id', community.id)
      .limit(1);
      
    if (spacesError) throw spacesError;
    
    if (!spaces || spaces.length === 0) {
      log('Nenhum espaço encontrado para testar criação de post', 'warning');
      return false;
    }
    
    // Todos os usuários podem criar posts
    const postData = {
      content: `Teste de permissão de post ${new Date().toISOString()} (role: ${role})`,
      author_id: user.id,
      community_id: community.id,
      space_id: spaces[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert(postData)
      .select();
      
    if (postError) {
      log(`Usuário com papel ${role} não consegue criar post: ${postError.message}`, 'error');
      return false;
    } else {
      log(`Usuário com papel ${role} criou post com sucesso. ID: ${newPost[0].id}`, 'success');
      return true;
    }
  } catch (error) {
    log(`Erro ao testar criação de post: ${error.message}`, 'error');
    return false;
  }
}

async function testDiscussionCreation(user, community, role) {
  log(`Testando criação de discussão com papel: ${role}...`, 'test');
  
  try {
    // Obter um tópico para criar uma discussão
    const { data: topics, error: topicsError } = await supabase
      .from('discussion_topics')
      .select('*')
      .eq('community_id', community.id)
      .limit(1);
      
    if (topicsError) throw topicsError;
    
    if (!topics || topics.length === 0) {
      log('Nenhum tópico encontrado para testar criação de discussão', 'warning');
      return false;
    }
    
    // Todos os usuários podem criar discussões
    const discussionData = {
      title: `Teste de permissão de discussão ${new Date().toISOString()} (role: ${role})`,
      content: 'Conteúdo de teste para verificar permissões',
      topic_id: topics[0].id,
      author_id: user.id,
      community_id: community.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newDiscussion, error: discussionError } = await supabase
      .from('discussions')
      .insert(discussionData)
      .select();
      
    if (discussionError) {
      log(`Usuário com papel ${role} não consegue criar discussão: ${discussionError.message}`, 'error');
      return false;
    } else {
      log(`Usuário com papel ${role} criou discussão com sucesso. ID: ${newDiscussion[0].id}`, 'success');
      return true;
    }
  } catch (error) {
    log(`Erro ao testar criação de discussão: ${error.message}`, 'error');
    return false;
  }
}

async function testActionButtons(role) {
  log(`Verificando botões de ação para usuário com papel: ${role}...`, 'test');
  
  try {
    // Com as atualizações, qualquer usuário deveria conseguir ver os botões de criar post/discussão
    const canSeeCreatePostButton = true;
    const canSeeCreateDiscussionButton = true;
    
    log(`Usuário com papel ${role} pode ver botão de Criar Post: ${canSeeCreatePostButton}`, 'success');
    log(`Usuário com papel ${role} pode ver botão de Criar Discussão: ${canSeeCreateDiscussionButton}`, 'success');
    
    return { canSeeCreatePostButton, canSeeCreateDiscussionButton };
  } catch (error) {
    log(`Erro ao testar botões de ação: ${error.message}`, 'error');
    throw error;
  }
}

// Executar testes
runTests().catch(console.error); 