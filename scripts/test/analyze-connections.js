// Script para analisar as conexões de dados em páginas e componentes
// Uso: node analyze-connections.js [--output=report.pdf]

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Diretório raiz do projeto
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Configurações para busca
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const MOCK_PATTERNS = ['useMockData', 'mockData', 'mock', 'Mock', 'mock/', 'MOCK_'];
const SUPABASE_PATTERNS = ['supabase', 'useQuery', 'useMutation', 'api.', 'ApiClient', 'repository', 'Repository'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'build', 'public'];

// Estrutura para armazenar resultados
const results = {
  pages: {},
  components: {},
  hooks: {},
  repositories: {},
  missingFeatures: []
};

// Utilitário de logging
const log = (message, type = 'info') => {
  const prefix = {
    info: '📘',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    analyzing: '🔍'
  }[type];
  
  console.log(`${prefix} ${message}`);
};

// Função para verificar se um arquivo contém indicações de dados mockados ou conexão real
async function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    
    // Determinar tipo de arquivo
    let fileType = 'unknown';
    if (relativePath.includes('/pages/')) {
      fileType = 'page';
    } else if (relativePath.includes('/components/')) {
      fileType = 'component';
    } else if (relativePath.includes('/hooks/')) {
      fileType = 'hook';
    } else if (relativePath.includes('/repositories/')) {
      fileType = 'repository';
    } else if (relativePath.includes('/context/')) {
      fileType = 'context';
    }
    
    // Verificar padrões de mock data
    const hasMockData = MOCK_PATTERNS.some(pattern => content.includes(pattern));
    
    // Verificar padrões de conexão real com Supabase
    const hasSupabaseConnection = SUPABASE_PATTERNS.some(pattern => content.includes(pattern));
    
    // Determinar status da conexão
    let connectionStatus = 'Desconhecido';
    if (hasMockData && hasSupabaseConnection) {
      // Analisar se possui um switch para mock data
      if (content.includes('useMockData') || content.includes('USE_MOCK_DATA')) {
        connectionStatus = 'Híbrido (fallback para mock)';
      } else {
        connectionStatus = 'Misto (verificar)';
      }
    } else if (hasMockData) {
      connectionStatus = 'Mockado';
    } else if (hasSupabaseConnection) {
      connectionStatus = 'Supabase';
    } else {
      connectionStatus = 'N/A (sem dados)';
    }
    
    // Extrair nome do componente ou página
    const nameMatch = content.match(/function\s+(\w+)|class\s+(\w+)|const\s+(\w+)\s*=/);
    let name = fileName.replace(/\.\w+$/, '');
    if (nameMatch) {
      name = nameMatch[1] || nameMatch[2] || nameMatch[3] || name;
    }
    
    // Extrair descrição/propósito (comentários acima da declaração)
    const descriptionMatch = content.match(/\/\*\*[\s\S]*?\*\/|\/\/\s*(.*)/);
    let description = '';
    if (descriptionMatch) {
      description = descriptionMatch[0].replace(/\/\*\*|\*\/|\/\/|\*/g, '').trim();
      // Limitar tamanho da descrição
      if (description.length > 100) {
        description = description.substring(0, 97) + '...';
      }
    }
    
    return {
      name,
      path: relativePath,
      type: fileType,
      connectionStatus,
      hasMockData,
      hasSupabaseConnection,
      description
    };
  } catch (error) {
    log(`Erro ao analisar arquivo ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Função recursiva para buscar e analisar arquivos
async function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Pular diretórios ignorados
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.includes(entry.name)) continue;
        await scanDirectory(fullPath);
        continue;
      }
      
      // Processar apenas arquivos com extensões relevantes
      const ext = path.extname(entry.name).toLowerCase();
      if (!FILE_EXTENSIONS.includes(ext)) continue;
      
      // Analisar arquivo
      log(`Analisando ${path.relative(PROJECT_ROOT, fullPath)}`, 'analyzing');
      const result = await analyzeFile(fullPath);
      
      if (result) {
        // Armazenar resultado na categoria apropriada
        if (result.type === 'page') {
          results.pages[result.name] = result;
        } else if (result.type === 'component') {
          results.components[result.name] = result;
        } else if (result.type === 'hook') {
          results.hooks[result.name] = result;
        } else if (result.type === 'repository') {
          results.repositories[result.name] = result;
        }
      }
    }
  } catch (error) {
    log(`Erro ao escanear diretório ${dir}: ${error.message}`, 'error');
  }
}

// Função para identificar features potencialmente esquecidas
function identifyMissingFeatures() {
  // Verificar recursos essenciais baseados nos arquivos de regras/schema
  const missingFeatures = [];
  
  // Verificar componentes/features de gamificação
  const hasPointsSystem = Object.values(results.components).some(c => 
    c.name.toLowerCase().includes('point') || c.name.toLowerCase().includes('leaderboard'));
  if (!hasPointsSystem) {
    missingFeatures.push({
      feature: "Sistema de Pontuação/Gamificação",
      descrição: "Componentes para exibição de pontos, ranking e histórico de pontos do usuário",
      prioridade: "Alta"
    });
  }
  
  // Verificar comunidades e multi-tenancy
  const hasCommunitySelection = Object.values(results.components).some(c => 
    c.name.toLowerCase().includes('communityselect') || c.name.toLowerCase().includes('selectcommunity'));
  if (!hasCommunitySelection) {
    missingFeatures.push({
      feature: "Seletor de Comunidade",
      descrição: "Componente para seleção de comunidade para usuários membros de múltiplas comunidades",
      prioridade: "Média"
    });
  }
  
  // Verificar perfil de usuário
  const hasUserProfile = Object.values(results.pages).some(p => 
    p.name.toLowerCase().includes('profile') || p.name.toLowerCase().includes('perfil'));
  if (!hasUserProfile) {
    missingFeatures.push({
      feature: "Perfil de Usuário",
      descrição: "Página de perfil de usuário para visualização/edição de informações e histórico de atividades",
      prioridade: "Alta"
    });
  }
  
  // Verificar notificações
  const hasNotifications = Object.values(results.components).some(c => 
    c.name.toLowerCase().includes('notification') || c.name.toLowerCase().includes('notificação'));
  if (!hasNotifications) {
    missingFeatures.push({
      feature: "Sistema de Notificações",
      descrição: "Componente para exibição e gerenciamento de notificações do usuário",
      prioridade: "Média"
    });
  }
  
  // Verificar recompensas
  const hasRewards = Object.values(results.components).some(c => 
    c.name.toLowerCase().includes('reward') || c.name.toLowerCase().includes('recompensa'));
  if (!hasRewards) {
    missingFeatures.push({
      feature: "Sistema de Recompensas",
      descrição: "Componentes para visualização e resgate de recompensas com pontos",
      prioridade: "Média"
    });
  }
  
  // Verificar configurações da comunidade
  const hasCommunitySettings = Object.values(results.pages).some(p => 
    p.name.toLowerCase().includes('setting') || p.name.toLowerCase().includes('config'));
  if (!hasCommunitySettings) {
    missingFeatures.push({
      feature: "Configurações da Comunidade",
      descrição: "Página para gerenciamento de configurações da comunidade (visibilidade, temas, etc.)",
      prioridade: "Alta"
    });
  }
  
  // Verificar analíticos
  const hasAnalytics = Object.values(results.components).some(c => 
    c.name.toLowerCase().includes('analytic') || c.name.toLowerCase().includes('chart'));
  if (!hasAnalytics) {
    missingFeatures.push({
      feature: "Dashboard de Analíticos",
      descrição: "Componentes para visualização de estatísticas e métricas da comunidade",
      prioridade: "Média"
    });
  }
  
  return missingFeatures;
}

// Função para gerar relatório em texto
function generateTextReport() {
  let report = '=== RELATÓRIO DE CONEXÕES DE DADOS ===\n\n';
  report += `Data de geração: ${new Date().toLocaleString()}\n\n`;
  
  // Resumo
  const totalPages = Object.keys(results.pages).length;
  const totalComponents = Object.keys(results.components).length;
  const mockPages = Object.values(results.pages).filter(p => p.connectionStatus === 'Mockado').length;
  const mockComponents = Object.values(results.components).filter(c => c.connectionStatus === 'Mockado').length;
  
  report += '=== RESUMO ===\n';
  report += `Total de Páginas: ${totalPages}\n`;
  report += `Total de Componentes: ${totalComponents}\n`;
  report += `Páginas com dados mockados: ${mockPages} (${Math.round(mockPages/totalPages*100)}%)\n`;
  report += `Componentes com dados mockados: ${mockComponents} (${Math.round(mockComponents/totalComponents*100)}%)\n\n`;
  
  // Páginas
  report += '=== PÁGINAS ===\n';
  for (const [name, page] of Object.entries(results.pages)) {
    report += `- ${name} (${page.path}): ${page.connectionStatus}\n`;
  }
  report += '\n';
  
  // Componentes
  report += '=== COMPONENTES ===\n';
  for (const [name, component] of Object.entries(results.components)) {
    report += `- ${name} (${component.path}): ${component.connectionStatus}\n`;
  }
  report += '\n';
  
  // Hooks
  report += '=== HOOKS ===\n';
  for (const [name, hook] of Object.entries(results.hooks)) {
    report += `- ${name} (${hook.path}): ${hook.connectionStatus}\n`;
  }
  report += '\n';
  
  // Repositories
  report += '=== REPOSITORIES ===\n';
  for (const [name, repo] of Object.entries(results.repositories)) {
    report += `- ${name} (${repo.path}): ${repo.connectionStatus}\n`;
  }
  report += '\n';
  
  // Features Missing
  report += '=== FEATURES POTENCIALMENTE FALTANTES ===\n';
  for (const feature of results.missingFeatures) {
    report += `- ${feature.feature} (Prioridade: ${feature.prioridade})\n`;
    report += `  Descrição: ${feature.descrição}\n\n`;
  }
  
  return report;
}

// Função para gerar PDF
async function generatePDF(outputPath) {
  try {
    // Criar novo documento PDF
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Adicionar página de capa
    const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4
    
    // Título
    coverPage.drawText('RELATÓRIO DE CONEXÕES DE DADOS', {
      x: 50,
      y: 750,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Subtítulo
    coverPage.drawText('Nortech Community Hub', {
      x: 50,
      y: 720,
      size: 16,
      font: helveticaFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Data
    coverPage.drawText(`Gerado em: ${new Date().toLocaleString()}`, {
      x: 50,
      y: 690,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Resumo na capa
    const totalPages = Object.keys(results.pages).length;
    const totalComponents = Object.keys(results.components).length;
    const mockPages = Object.values(results.pages).filter(p => p.connectionStatus === 'Mockado').length;
    const mockComponents = Object.values(results.components).filter(c => c.connectionStatus === 'Mockado').length;
    
    coverPage.drawText('Resumo do Status de Conexão', {
      x: 50,
      y: 620,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    coverPage.drawText([
      `Total de Páginas: ${totalPages}`,
      `Total de Componentes: ${totalComponents}`,
      `Páginas com dados mockados: ${mockPages} (${Math.round(mockPages/totalPages*100)}%)`,
      `Componentes com dados mockados: ${mockComponents} (${Math.round(mockComponents/totalComponents*100)}%)`
    ].join('\n'), {
      x: 50,
      y: 590,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Página de páginas
    const pagesPage = pdfDoc.addPage([595.28, 841.89]);
    pagesPage.drawText('PÁGINAS', {
      x: 50,
      y: 800,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    let yPos = 770;
    for (const [name, page] of Object.entries(results.pages)) {
      // Verifica se precisa de uma nova página
      if (yPos < 50) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        newPage.drawText('PÁGINAS (continuação)', {
          x: 50,
          y: 800,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        yPos = 770;
      }
      
      const statusColor = page.connectionStatus === 'Mockado' ? rgb(0.8, 0, 0) : 
                          page.connectionStatus === 'Supabase' ? rgb(0, 0.6, 0) : 
                          rgb(0.8, 0.6, 0);
      
      pagesPage.drawText(`${name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      
      pagesPage.drawText(`Status: ${page.connectionStatus}`, {
        x: 250,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: statusColor
      });
      
      yPos -= 20;
      pagesPage.drawText(`Caminho: ${page.path}`, {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      yPos -= 25;
    }
    
    // Página de componentes
    const componentsPage = pdfDoc.addPage([595.28, 841.89]);
    componentsPage.drawText('COMPONENTES', {
      x: 50,
      y: 800,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    yPos = 770;
    for (const [name, component] of Object.entries(results.components)) {
      // Verifica se precisa de uma nova página
      if (yPos < 50) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        newPage.drawText('COMPONENTES (continuação)', {
          x: 50,
          y: 800,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        yPos = 770;
      }
      
      const statusColor = component.connectionStatus === 'Mockado' ? rgb(0.8, 0, 0) : 
                          component.connectionStatus === 'Supabase' ? rgb(0, 0.6, 0) : 
                          rgb(0.8, 0.6, 0);
      
      componentsPage.drawText(`${name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      
      componentsPage.drawText(`Status: ${component.connectionStatus}`, {
        x: 250,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: statusColor
      });
      
      yPos -= 20;
      componentsPage.drawText(`Caminho: ${component.path}`, {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      yPos -= 25;
    }
    
    // Página de hooks e repositories
    const hooksPage = pdfDoc.addPage([595.28, 841.89]);
    hooksPage.drawText('HOOKS E REPOSITÓRIOS', {
      x: 50,
      y: 800,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    yPos = 770;
    hooksPage.drawText('HOOKS:', {
      x: 50,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0.7)
    });
    
    yPos -= 25;
    for (const [name, hook] of Object.entries(results.hooks)) {
      // Verifica se precisa de uma nova página
      if (yPos < 50) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        newPage.drawText('HOOKS (continuação)', {
          x: 50,
          y: 800,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        yPos = 770;
      }
      
      const statusColor = hook.connectionStatus === 'Mockado' ? rgb(0.8, 0, 0) : 
                          hook.connectionStatus === 'Supabase' ? rgb(0, 0.6, 0) : 
                          rgb(0.8, 0.6, 0);
      
      hooksPage.drawText(`${name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      
      hooksPage.drawText(`Status: ${hook.connectionStatus}`, {
        x: 250,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: statusColor
      });
      
      yPos -= 20;
      hooksPage.drawText(`Caminho: ${hook.path}`, {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      yPos -= 25;
    }
    
    // Repositories na mesma página
    yPos -= 20;
    hooksPage.drawText('REPOSITÓRIOS:', {
      x: 50,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0.7)
    });
    
    yPos -= 25;
    for (const [name, repo] of Object.entries(results.repositories)) {
      // Verifica se precisa de uma nova página
      if (yPos < 50) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        newPage.drawText('REPOSITÓRIOS (continuação)', {
          x: 50,
          y: 800,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        yPos = 770;
      }
      
      const statusColor = repo.connectionStatus === 'Mockado' ? rgb(0.8, 0, 0) : 
                          repo.connectionStatus === 'Supabase' ? rgb(0, 0.6, 0) : 
                          rgb(0.8, 0.6, 0);
      
      hooksPage.drawText(`${name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      
      hooksPage.drawText(`Status: ${repo.connectionStatus}`, {
        x: 250,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: statusColor
      });
      
      yPos -= 20;
      hooksPage.drawText(`Caminho: ${repo.path}`, {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      yPos -= 25;
    }
    
    // Página de features faltantes
    if (results.missingFeatures.length > 0) {
      const featuresPage = pdfDoc.addPage([595.28, 841.89]);
      featuresPage.drawText('FEATURES POTENCIALMENTE FALTANTES', {
        x: 50,
        y: 800,
        size: 18,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      
      yPos = 760;
      for (const feature of results.missingFeatures) {
        // Verifica se precisa de uma nova página
        if (yPos < 100) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          newPage.drawText('FEATURES POTENCIALMENTE FALTANTES (continuação)', {
            x: 50,
            y: 800,
            size: 18,
            font: helveticaBold,
            color: rgb(0, 0, 0.8)
          });
          yPos = 760;
        }
        
        const prioridadeColor = feature.prioridade === 'Alta' ? rgb(0.8, 0, 0) : 
                               feature.prioridade === 'Média' ? rgb(0.8, 0.6, 0) : 
                               rgb(0, 0.6, 0);
        
        featuresPage.drawText(`${feature.feature}`, {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        
        featuresPage.drawText(`Prioridade: ${feature.prioridade}`, {
          x: 300,
          y: yPos,
          size: 12,
          font: helveticaFont,
          color: prioridadeColor
        });
        
        yPos -= 25;
        
        // Quebrar descrição em linhas de 70 caracteres
        const description = feature.descrição;
        const lines = [];
        for (let i = 0; i < description.length; i += 70) {
          lines.push(description.substring(i, i + 70));
        }
        
        for (const line of lines) {
          featuresPage.drawText(line, {
            x: 50,
            y: yPos,
            size: 10,
            font: helveticaFont,
            color: rgb(0.3, 0.3, 0.3)
          });
          yPos -= 15;
        }
        
        yPos -= 15;
      }
    }
    
    // Salvar o documento
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    log(`Relatório PDF gerado em: ${outputPath}`, 'success');
    return outputPath;
  } catch (error) {
    log(`Erro ao gerar PDF: ${error.message}`, 'error');
    throw error;
  }
}

// Função principal
async function main() {
  try {
    const args = process.argv.slice(2);
    let outputPath = 'connection-report.pdf';
    
    // Verificar argumento de saída
    const outputArg = args.find(arg => arg.startsWith('--output='));
    if (outputArg) {
      outputPath = outputArg.split('=')[1];
    }
    
    log('Iniciando análise de conexões de dados...', 'info');
    
    // Escanear diretórios principais
    await scanDirectory(SRC_DIR);
    
    // Identificar features faltantes
    results.missingFeatures = identifyMissingFeatures();
    
    // Gerar relatório de texto
    const textReport = generateTextReport();
    fs.writeFileSync('connection-report.txt', textReport);
    log('Relatório de texto gerado em: connection-report.txt', 'success');
    
    // Instalar dependência pdf-lib se necessário
    try {
      require('pdf-lib');
    } catch (e) {
      log('Instalando dependência pdf-lib...', 'info');
      execSync('npm install pdf-lib');
    }
    
    // Gerar relatório PDF
    await generatePDF(outputPath);
    
    log('Análise concluída com sucesso!', 'success');
  } catch (error) {
    log(`Erro durante a análise: ${error.message}`, 'error');
    console.error(error);
  }
}

// Executar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  analyzeFile,
  scanDirectory,
  generateTextReport,
  generatePDF
}; 