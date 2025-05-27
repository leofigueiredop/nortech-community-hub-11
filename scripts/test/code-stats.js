// Script para analisar estatísticas de código-fonte
// Uso: node code-stats.js [--output=estatisticas-codigo.pdf]

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Diretório raiz do projeto
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Configurações para busca
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.html', '.json'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'build', 'public', 'coverage'];

// Diretórios que contêm principalmente código do frontend original
const ORIGINAL_FRONTEND_DIRS = [
  'components/ui',
  'components/home',
  'components/layout',
  'data',
  'types'
];

// Marcadores para identificar código do frontend original
const FRONT_ORIGINAL_MARKERS = [
  '@original', 
  '@frontend-original', 
  '@legacy',
  'shadcn',
  'Original frontend code',
  'mockLibraryData',
  'mockCourseData'
];

// Padrões de nomes de arquivos que indicam código original
const ORIGINAL_FILENAME_PATTERNS = [
  'ui/',
  'mock',
  'types',
  'utils.ts',
  'context/'
];

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

// Função para verificar se o arquivo está em um diretório do frontend original
function isInOriginalDir(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  return ORIGINAL_FRONTEND_DIRS.some(dir => relativePath.startsWith(dir));
}

// Função para verificar se o nome do arquivo indica código original
function hasOriginalFilenamePattern(filePath) {
  const filename = path.basename(filePath);
  const relativePath = path.relative(SRC_DIR, filePath);
  return ORIGINAL_FILENAME_PATTERNS.some(pattern => relativePath.includes(pattern));
}

// Função para verificar se o arquivo é do frontend original
function isOriginalFrontend(content, filePath) {
  // Verificar por marcadores no conteúdo
  const hasMarkers = FRONT_ORIGINAL_MARKERS.some(marker => content.includes(marker)) ||
         content.includes('// Original frontend code') ||
         content.includes('/* Original frontend code */');

  // Verificar pela localização do arquivo
  const isInOriginalDirectory = isInOriginalDir(filePath);
  
  // Verificar pelo padrão do nome do arquivo
  const hasOriginalPattern = hasOriginalFilenamePattern(filePath);
  
  // Verificar se é um arquivo de componente shadcn/ui
  const isShadcnComponent = filePath.includes('/ui/') && 
                           !filePath.includes('FileUploader') && 
                           !filePath.includes('Spinner');
  
  // Verificar se é um arquivo de mock data
  const isMockData = filePath.includes('mock') || 
                    filePath.includes('data/') || 
                    content.includes('export const mock');
  
  // Se qualquer uma das condições for verdadeira, consideramos como frontend original
  return hasMarkers || isInOriginalDirectory || hasOriginalPattern || isShadcnComponent || isMockData;
}

// Função para analisar um arquivo e contar linhas
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    
    // Verifica se é código original do frontend
    const isOriginal = isOriginalFrontend(content, filePath);
    
    // Contar linhas de código (excluindo linhas em branco e comentários puros)
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith('/*') &&
             !trimmed.startsWith('*') &&
             !trimmed.startsWith('*/');
    }).length;
    
    // Contar comentários
    const commentLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('//') || 
             trimmed.startsWith('/*') ||
             trimmed.startsWith('*') ||
             trimmed.startsWith('*/');
    }).length;
    
    // Contar linhas em branco
    const blankLines = lines.filter(line => line.trim() === '').length;
    
    return {
      path: filePath,
      totalLines: lineCount,
      codeLines,
      commentLines,
      blankLines,
      isOriginalFrontend: isOriginal
    };
  } catch (error) {
    log(`Erro ao analisar arquivo ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Função recursiva para buscar e analisar arquivos
async function scanDirectory(dir) {
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    totalCodeLines: 0,
    totalCommentLines: 0,
    totalBlankLines: 0,
    originalFrontend: {
      files: 0,
      lines: 0,
      codeLines: 0
    },
    added: {
      files: 0,
      lines: 0,
      codeLines: 0
    },
    byExtension: {}
  };
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Pular diretórios ignorados
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.includes(entry.name)) continue;
        
        // Recursivamente analisar subdiretórios e mesclar estatísticas
        const dirStats = await scanDirectory(fullPath);
        
        // Adicionar estatísticas deste diretório às estatísticas totais
        stats.totalFiles += dirStats.totalFiles;
        stats.totalLines += dirStats.totalLines;
        stats.totalCodeLines += dirStats.totalCodeLines;
        stats.totalCommentLines += dirStats.totalCommentLines;
        stats.totalBlankLines += dirStats.totalBlankLines;
        
        stats.originalFrontend.files += dirStats.originalFrontend.files;
        stats.originalFrontend.lines += dirStats.originalFrontend.lines;
        stats.originalFrontend.codeLines += dirStats.originalFrontend.codeLines;
        
        stats.added.files += dirStats.added.files;
        stats.added.lines += dirStats.added.lines;
        stats.added.codeLines += dirStats.added.codeLines;
        
        // Mesclar estatísticas por extensão
        for (const [ext, extStats] of Object.entries(dirStats.byExtension)) {
          if (!stats.byExtension[ext]) {
            stats.byExtension[ext] = { ...extStats };
          } else {
            stats.byExtension[ext].files += extStats.files;
            stats.byExtension[ext].lines += extStats.lines;
            stats.byExtension[ext].codeLines += extStats.codeLines;
          }
        }
        
        continue;
      }
      
      // Processar apenas arquivos com extensões relevantes
      const ext = path.extname(entry.name).toLowerCase();
      if (!FILE_EXTENSIONS.includes(ext)) continue;
      
      // Analisar arquivo
      log(`Analisando ${path.relative(PROJECT_ROOT, fullPath)}`, 'analyzing');
      const fileStats = analyzeFile(fullPath);
      
      if (fileStats) {
        stats.totalFiles++;
        stats.totalLines += fileStats.totalLines;
        stats.totalCodeLines += fileStats.codeLines;
        stats.totalCommentLines += fileStats.commentLines;
        stats.totalBlankLines += fileStats.blankLines;
        
        // Categorizar entre código original e código adicionado
        if (fileStats.isOriginalFrontend) {
          stats.originalFrontend.files++;
          stats.originalFrontend.lines += fileStats.totalLines;
          stats.originalFrontend.codeLines += fileStats.codeLines;
        } else {
          stats.added.files++;
          stats.added.lines += fileStats.totalLines;
          stats.added.codeLines += fileStats.codeLines;
        }
        
        // Agrupar por extensão de arquivo
        if (!stats.byExtension[ext]) {
          stats.byExtension[ext] = {
            files: 1,
            lines: fileStats.totalLines,
            codeLines: fileStats.codeLines
          };
        } else {
          stats.byExtension[ext].files++;
          stats.byExtension[ext].lines += fileStats.totalLines;
          stats.byExtension[ext].codeLines += fileStats.codeLines;
        }
      }
    }
    
    return stats;
  } catch (error) {
    log(`Erro ao escanear diretório ${dir}: ${error.message}`, 'error');
    return stats;
  }
}

// Função para gerar relatório em texto
function generateTextReport(stats) {
  let report = '=== ESTATÍSTICAS DE CÓDIGO DO PROJETO ===\n\n';
  report += `Data de geração: ${new Date().toLocaleString()}\n\n`;
  
  // Estatísticas gerais
  report += '=== ESTATÍSTICAS GERAIS ===\n';
  report += `Total de Arquivos: ${stats.totalFiles}\n`;
  report += `Total de Linhas: ${stats.totalLines}\n`;
  report += `Linhas de Código: ${stats.totalCodeLines} (${Math.round(stats.totalCodeLines/stats.totalLines*100)}%)\n`;
  report += `Linhas de Comentário: ${stats.totalCommentLines} (${Math.round(stats.totalCommentLines/stats.totalLines*100)}%)\n`;
  report += `Linhas em Branco: ${stats.totalBlankLines} (${Math.round(stats.totalBlankLines/stats.totalLines*100)}%)\n\n`;
  
  // Comparação entre código original e adicionado
  report += '=== CÓDIGO ORIGINAL vs. ADICIONADO ===\n';
  report += `Código Original do Frontend:\n`;
  report += `  - Arquivos: ${stats.originalFrontend.files} (${Math.round(stats.originalFrontend.files/stats.totalFiles*100)}%)\n`;
  report += `  - Linhas Totais: ${stats.originalFrontend.lines} (${Math.round(stats.originalFrontend.lines/stats.totalLines*100)}%)\n`;
  report += `  - Linhas de Código: ${stats.originalFrontend.codeLines} (${Math.round(stats.originalFrontend.codeLines/stats.totalCodeLines*100)}%)\n\n`;
  
  report += `Código Adicionado/Modificado:\n`;
  report += `  - Arquivos: ${stats.added.files} (${Math.round(stats.added.files/stats.totalFiles*100)}%)\n`;
  report += `  - Linhas Totais: ${stats.added.lines} (${Math.round(stats.added.lines/stats.totalLines*100)}%)\n`;
  report += `  - Linhas de Código: ${stats.added.codeLines} (${Math.round(stats.added.codeLines/stats.totalCodeLines*100)}%)\n\n`;
  
  // Estatísticas por tipo de arquivo
  report += '=== ESTATÍSTICAS POR TIPO DE ARQUIVO ===\n';
  for (const [ext, extStats] of Object.entries(stats.byExtension).sort((a, b) => b[1].lines - a[1].lines)) {
    report += `${ext}:\n`;
    report += `  - Arquivos: ${extStats.files}\n`;
    report += `  - Linhas Totais: ${extStats.lines} (${Math.round(extStats.lines/stats.totalLines*100)}%)\n`;
    report += `  - Linhas de Código: ${extStats.codeLines}\n\n`;
  }
  
  return report;
}

// Função para gerar PDF
async function generatePDF(stats, outputPath) {
  try {
    // Criar novo documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Definir metadados do documento
    pdfDoc.setTitle('Estatísticas de Código - Nortech Community Hub');
    pdfDoc.setAuthor('Sistema de Análise de Código');
    pdfDoc.setSubject('Análise de Linhas de Código');
    pdfDoc.setKeywords(['nortech', 'estatísticas', 'código', 'análise', 'linhas']);
    pdfDoc.setCreator('Nortech Test Suite');
    
    // Configuração de página - A4 Retrato
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const MARGIN_LEFT = 60;
    const MARGIN_RIGHT = 60;
    const MARGIN_TOP = 60;
    const MARGIN_BOTTOM = 60;
    
    // Fontes
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    // Página de capa
    const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título
    coverPage.drawText('ESTATÍSTICAS DE CÓDIGO', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 150,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Subtítulo
    coverPage.drawText('Nortech Community Hub', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 180,
      size: 16,
      font: helveticaFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Data
    coverPage.drawText(`Análise realizada em: ${new Date().toLocaleString()}`, {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 220,
      size: 12,
      font: helveticaOblique,
      color: rgb(0, 0, 0.6)
    });
    
    // Resumo na capa
    coverPage.drawText('Resumo das Estatísticas', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 280,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Dados gerais
    coverPage.drawText([
      `Total de Arquivos: ${stats.totalFiles}`,
      `Total de Linhas: ${stats.totalLines}`,
      `Linhas de Código: ${stats.totalCodeLines} (${Math.round(stats.totalCodeLines/stats.totalLines*100)}%)`,
      `Código Original do Frontend: ${stats.originalFrontend.lines} linhas (${Math.round(stats.originalFrontend.lines/stats.totalLines*100)}%)`,
      `Código Adicionado: ${stats.added.lines} linhas (${Math.round(stats.added.lines/stats.totalLines*100)}%)`
    ].join('\n'), {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 310,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Adicionar um gráfico simples para representar a proporção
    const originalPercentage = Math.round(stats.originalFrontend.lines/stats.totalLines*100);
    const addedPercentage = 100 - originalPercentage;
    
    // Título do gráfico
    coverPage.drawText('Proporção de Código Original vs. Adicionado', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 420,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Desenhar barras do gráfico
    const barY = PAGE_HEIGHT - 450;
    const barHeight = 30;
    const barWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    
    // Barra para código original
    const originalWidth = barWidth * (originalPercentage / 100);
    coverPage.drawRectangle({
      x: MARGIN_LEFT,
      y: barY,
      width: originalWidth,
      height: barHeight,
      color: rgb(0.2, 0.6, 0.3)
    });
    
    // Barra para código adicionado
    coverPage.drawRectangle({
      x: MARGIN_LEFT + originalWidth,
      y: barY,
      width: barWidth - originalWidth,
      height: barHeight,
      color: rgb(0.3, 0.4, 0.8)
    });
    
    // Legendas
    coverPage.drawText(`Código Original (${originalPercentage}%)`, {
      x: MARGIN_LEFT + 10,
      y: barY - 20,
      size: 10,
      font: helveticaFont,
      color: rgb(0.2, 0.6, 0.3)
    });
    
    coverPage.drawText(`Código Adicionado (${addedPercentage}%)`, {
      x: MARGIN_LEFT + originalWidth + 10,
      y: barY - 20,
      size: 10,
      font: helveticaFont,
      color: rgb(0.3, 0.4, 0.8)
    });
    
    // Página de estatísticas detalhadas
    const detailsPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título da página
    detailsPage.drawText('ESTATÍSTICAS DETALHADAS', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - MARGIN_TOP,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Estatísticas por tipo de arquivo
    let yPos = PAGE_HEIGHT - MARGIN_TOP - 40;
    
    detailsPage.drawText('Estatísticas por Tipo de Arquivo', {
      x: MARGIN_LEFT,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    yPos -= 30;
    
    // Cabeçalho da tabela
    detailsPage.drawText('Extensão', {
      x: MARGIN_LEFT,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    detailsPage.drawText('Arquivos', {
      x: MARGIN_LEFT + 100,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    detailsPage.drawText('Linhas', {
      x: MARGIN_LEFT + 180,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    detailsPage.drawText('% do Total', {
      x: MARGIN_LEFT + 260,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0.8)
    });
    
    yPos -= 20;
    
    // Linhas da tabela - ordenadas por número de linhas
    const sortedExtensions = Object.entries(stats.byExtension).sort((a, b) => b[1].lines - a[1].lines);
    
    for (const [ext, extStats] of sortedExtensions) {
      // Verificar se precisamos de uma nova página
      if (yPos < MARGIN_BOTTOM + 40) {
        detailsPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        yPos = PAGE_HEIGHT - MARGIN_TOP - 40;
        
        // Título da continuação
        detailsPage.drawText('ESTATÍSTICAS DETALHADAS (continuação)', {
          x: MARGIN_LEFT,
          y: PAGE_HEIGHT - MARGIN_TOP,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        
        yPos -= 40;
      }
      
      // Extensão
      detailsPage.drawText(ext, {
        x: MARGIN_LEFT,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0.8)
      });
      
      // Número de arquivos
      detailsPage.drawText(extStats.files.toString(), {
        x: MARGIN_LEFT + 100,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0.8)
      });
      
      // Número de linhas
      detailsPage.drawText(extStats.lines.toString(), {
        x: MARGIN_LEFT + 180,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0.8)
      });
      
      // Porcentagem do total
      const percentage = Math.round(extStats.lines/stats.totalLines*100);
      detailsPage.drawText(`${percentage}%`, {
        x: MARGIN_LEFT + 260,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0.8)
      });
      
      yPos -= 20;
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
    let outputPath = 'estatisticas-codigo.pdf';
    
    // Verificar argumento de saída
    const outputArg = args.find(arg => arg.startsWith('--output='));
    if (outputArg) {
      outputPath = outputArg.split('=')[1];
    }
    
    log('Iniciando análise de estatísticas de código...', 'info');
    
    // Escanear diretórios principais
    const stats = await scanDirectory(SRC_DIR);
    
    // Gerar relatório de texto
    const textReport = generateTextReport(stats);
    fs.writeFileSync('estatisticas-codigo.txt', textReport);
    log('Relatório de texto gerado em: estatisticas-codigo.txt', 'success');
    
    // Instalar dependência pdf-lib se necessário
    try {
      require('pdf-lib');
    } catch (e) {
      log('Instalando dependência pdf-lib...', 'info');
      execSync('npm install pdf-lib');
    }
    
    // Gerar relatório PDF
    await generatePDF(stats, outputPath);
    
    log('Análise concluída com sucesso!', 'success');
    
    // Exibir resumo rápido no console
    console.log('\n=== RESUMO DE ESTATÍSTICAS ===');
    console.log(`Total de Arquivos: ${stats.totalFiles}`);
    console.log(`Total de Linhas: ${stats.totalLines}`);
    console.log(`Código Original do Frontend: ${stats.originalFrontend.lines} linhas (${Math.round(stats.originalFrontend.lines/stats.totalLines*100)}%)`);
    console.log(`Código Adicionado: ${stats.added.lines} linhas (${Math.round(stats.added.lines/stats.totalLines*100)}%)`);
    
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