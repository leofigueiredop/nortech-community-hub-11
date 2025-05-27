// Script para gerar um relatório de status em PDF
// Uso: node generate-status-report.js [--output=status-report.pdf]

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const marked = require('marked');

// Configurações
const INPUT_MD = path.resolve(__dirname, 'status-report.md');
const DEFAULT_OUTPUT = path.resolve(__dirname, 'status-report.pdf');

// Configuração de página - A4 Retrato (595.28 x 841.89 pontos)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 60;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

// Utilitário de logging
const log = (message, type = 'info') => {
  const prefix = {
    info: '📘',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];
  
  console.log(`${prefix} ${message}`);
};

// Função para ler o conteúdo markdown
function readMarkdown(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Erro ao ler arquivo ${filePath}: ${error.message}`, 'error');
    throw error;
  }
}

// Função para remover caracteres não suportados pela fonte
function sanitizeText(text) {
  // Substituir emojis e outros caracteres especiais por equivalentes em texto
  return text
    .replace(/✅/g, '[OK]')
    .replace(/❌/g, '[ERRO]')
    .replace(/⚠️/g, '[ALERTA]')
    .replace(/📘/g, '[INFO]')
    .replace(/[^\x00-\x7F]/g, ''); // Remove outros caracteres não ASCII
}

// Função para criar PDF a partir do markdown
async function generatePDF(markdown, outputPath) {
  try {
    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Definir metadados do documento
    pdfDoc.setTitle('Relatório de Status - Nortech Community Hub');
    pdfDoc.setAuthor('Sistema de Teste Automatizado');
    pdfDoc.setSubject('Análise de Conexões com Supabase');
    pdfDoc.setKeywords(['nortech', 'supabase', 'relatório', 'status', 'análise']);
    pdfDoc.setCreator('Nortech Test Suite');
    
    // Carregar fontes
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    
    // Título do documento
    const title = markdown.match(/^#\s+(.*)/m)?.[1] || 'Relatório de Status';
    
    // Dividir o documento em seções para processamento
    const sections = [];
    let currentSection = '';
    let sectionTitle = '';
    
    markdown.split('\n').forEach((line) => {
      // Detectar títulos de seção (##)
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push({
            title: sectionTitle,
            content: currentSection.trim()
          });
        }
        sectionTitle = line.replace('## ', '');
        currentSection = line + '\n';
      } 
      // Detectar subseções (###)
      else if (line.startsWith('### ')) {
        currentSection += line + '\n';
      } 
      // Conteúdo normal
      else {
        currentSection += line + '\n';
      }
    });
    
    // Adicionar a última seção
    if (currentSection) {
      sections.push({
        title: sectionTitle,
        content: currentSection.trim()
      });
    }
    
    // Adicionar página de capa
    const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título na capa
    coverPage.drawText(sanitizeText(title), {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 150,
      size: 24,
      font: timesRomanBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Data na capa
    const date = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    coverPage.drawText(`Data: ${date}`, {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 200,
      size: 14,
      font: timesRomanItalic,
      color: rgb(0, 0, 0.6)
    });
    
    // Texto adicional na capa
    coverPage.drawText('DOCUMENTO INTERNO', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 250,
      size: 16,
      font: timesRomanBold,
      color: rgb(0.7, 0, 0)
    });
    
    coverPage.drawText('Nortech Community Hub', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 280,
      size: 14,
      font: timesRomanItalic,
      color: rgb(0, 0, 0.6)
    });
    
    // Linha horizontal decorativa
    coverPage.drawLine({
      start: { x: MARGIN_LEFT, y: PAGE_HEIGHT - 300 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: PAGE_HEIGHT - 300 },
      thickness: 1,
      color: rgb(0.7, 0, 0),
    });
    
    // Informações de status na capa
    const totalPages = Object.keys(sections).length + 1; // +1 para a capa
    
    coverPage.drawText('Sumário de Status', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 350,
      size: 16,
      font: timesRomanBold,
      color: rgb(0, 0, 0.8)
    });
    
    // Extrair estatísticas do markdown
    const statsMatch = markdown.match(/## Estatísticas de Conexão([\s\S]*?)(?=##|$)/);
    if (statsMatch) {
      let statsText = statsMatch[1].trim();
      // Remover marcadores de lista e quebrar em linhas
      statsText = statsText.replace(/- \*\*([^:]+):\*\*/g, '• $1:').replace(/  -/g, '  •');
      
      const statsLines = statsText.split('\n').filter(line => line.trim());
      
      let yPos = PAGE_HEIGHT - 380;
      for (const line of statsLines) {
        coverPage.drawText(sanitizeText(line.trim()), {
          x: MARGIN_LEFT + 10,
          y: yPos,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0.8)
        });
        yPos -= 20;
      }
    }
    
    // Logo ou texto de rodapé na capa
    coverPage.drawText('Relatório gerado automaticamente', {
      x: MARGIN_LEFT,
      y: MARGIN_BOTTOM + 20,
      size: 10,
      font: timesRomanItalic,
      color: rgb(0, 0, 0.6)
    });
    
    // Adicionar data e hora de geração
    coverPage.drawText(`Gerado em: ${new Date().toLocaleString()}`, {
      x: MARGIN_LEFT,
      y: MARGIN_BOTTOM,
      size: 10,
      font: timesRomanItalic,
      color: rgb(0, 0, 0.6)
    });
    
    // Adicionar páginas de numeração
    let pageNumber = 1;
    coverPage.drawText(`${pageNumber} / ${totalPages}`, {
      x: PAGE_WIDTH - MARGIN_RIGHT - 40,
      y: MARGIN_BOTTOM,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0.6)
    });
    
    // Adicionar páginas de conteúdo para cada seção
    let currentPage = null;
    
    // Processar cada seção
    for (const section of sections) {
      // Criar nova página para a seção
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pageNumber++;
      
      // Adicionar número da página
      currentPage.drawText(`${pageNumber} / ${totalPages}`, {
        x: PAGE_WIDTH - MARGIN_RIGHT - 40,
        y: MARGIN_BOTTOM,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0.6)
      });
      
      // Adicionar cabeçalho
      currentPage.drawText('Nortech Community Hub - Relatório de Status', {
        x: MARGIN_LEFT,
        y: PAGE_HEIGHT - MARGIN_TOP + 20,
        size: 10,
        font: timesRomanItalic,
        color: rgb(0, 0, 0.6)
      });
      
      let yPosition = PAGE_HEIGHT - MARGIN_TOP - 20;
      
      // Título da seção
      currentPage.drawText(sanitizeText(section.title), {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 18,
        font: timesRomanBold,
        color: rgb(0, 0, 0.8)
      });
      
      yPosition -= 30;
      
      // Processar o conteúdo da seção
      const lines = section.content.split('\n').filter(line => !line.startsWith('## '));
      
      for (const line of lines) {
        // Verificar se precisamos de uma nova página
        if (yPosition < MARGIN_BOTTOM + 40) {
          currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          pageNumber++;
          
          // Adicionar número da página
          currentPage.drawText(`${pageNumber} / ${totalPages}`, {
            x: PAGE_WIDTH - MARGIN_RIGHT - 40,
            y: MARGIN_BOTTOM,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0.6)
          });
          
          // Adicionar cabeçalho
          currentPage.drawText('Nortech Community Hub - Relatório de Status', {
            x: MARGIN_LEFT,
            y: PAGE_HEIGHT - MARGIN_TOP + 20,
            size: 10,
            font: timesRomanItalic,
            color: rgb(0, 0, 0.6)
          });
          
          yPosition = PAGE_HEIGHT - MARGIN_TOP - 20;
          
          // Continuar seção
          currentPage.drawText(`${section.title} (continuação)`, {
            x: MARGIN_LEFT,
            y: yPosition,
            size: 16,
            font: timesRomanBold,
            color: rgb(0, 0, 0.8)
          });
          
          yPosition -= 30;
        }
        
        // Processamento de linha vazia
        if (!line.trim()) {
          yPosition -= 15;
          continue;
        }
        
        // Processamento de subseções (###)
        if (line.startsWith('### ')) {
          const subSectionTitle = line.replace('### ', '');
          
          // Adicionar um pouco mais de espaço antes da subseção
          yPosition -= 15;
          
          currentPage.drawText(sanitizeText(subSectionTitle), {
            x: MARGIN_LEFT,
            y: yPosition,
            size: 16,
            font: timesRomanBold,
            color: rgb(0, 0, 0.7)
          });
          
          yPosition -= 25;
          continue;
        }
        
        // Processamento de listas (- ou *)
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const listItemText = line.trim().substring(2);
          
          // Adicionar marcador
          currentPage.drawText('•', {
            x: MARGIN_LEFT + 5,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0.8)
          });
          
          // Adicionar texto do item com recuo
          currentPage.drawText(sanitizeText(listItemText), {
            x: MARGIN_LEFT + 20,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0.8)
          });
          
          yPosition -= 20;
          continue;
        }
        
        // Processamento de listas numeradas (1. 2. etc)
        const numberedListMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
        if (numberedListMatch) {
          const number = numberedListMatch[1];
          const listItemText = numberedListMatch[2];
          
          // Adicionar número
          currentPage.drawText(`${number}.`, {
            x: MARGIN_LEFT + 5,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0.8)
          });
          
          // Adicionar texto do item com recuo
          currentPage.drawText(sanitizeText(listItemText), {
            x: MARGIN_LEFT + 25,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0.8)
          });
          
          yPosition -= 20;
          continue;
        }
        
        // Processamento de texto com destaque (negrito)
        // Primeiro vamos ver se a linha contém texto em negrito
        let boldMatches = [];
        let boldMatch;
        const boldRegex = /\*\*(.*?)\*\*/g;
        while ((boldMatch = boldRegex.exec(line)) !== null) {
          boldMatches.push({
            full: boldMatch[0],
            text: boldMatch[1],
            index: boldMatch.index
          });
        }
        
        // Se a linha tiver texto em negrito, precisamos separá-la em partes
        if (boldMatches.length > 0) {
          let lastIndex = 0;
          let xPosition = MARGIN_LEFT;
          
          for (const match of boldMatches) {
            // Texto normal antes do negrito
            const normalText = line.substring(lastIndex, match.index);
            if (normalText) {
              currentPage.drawText(sanitizeText(normalText), {
                x: xPosition,
                y: yPosition,
                size: 12,
                font: timesRomanFont,
                color: rgb(0, 0, 0.8)
              });
              
              xPosition += timesRomanFont.widthOfTextAtSize(sanitizeText(normalText), 12);
            }
            
            // Texto em negrito
            currentPage.drawText(sanitizeText(match.text), {
              x: xPosition,
              y: yPosition,
              size: 12,
              font: timesRomanBold,
              color: rgb(0, 0, 0.8)
            });
            
            xPosition += timesRomanBold.widthOfTextAtSize(sanitizeText(match.text), 12);
            lastIndex = match.index + match.full.length;
          }
          
          // Texto normal após o último negrito
          const remainingText = line.substring(lastIndex);
          if (remainingText) {
            currentPage.drawText(sanitizeText(remainingText), {
              x: xPosition,
              y: yPosition,
              size: 12,
              font: timesRomanFont,
              color: rgb(0, 0, 0.8)
            });
          }
        } else {
          // Texto normal sem formatação especial
          currentPage.drawText(sanitizeText(line), {
            x: MARGIN_LEFT,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0.8)
          });
        }
        
        // Mover para a próxima linha
        yPosition -= 20;
      }
    }
    
    // Salvar o documento
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    log(`Relatório PDF gerado com sucesso em: ${outputPath}`, 'success');
    return outputPath;
  } catch (error) {
    log(`Erro ao gerar PDF: ${error.message}`, 'error');
    throw error;
  }
}

// Função principal
async function main() {
  try {
    // Analisar argumentos
    const args = process.argv.slice(2);
    let outputPath = DEFAULT_OUTPUT;
    
    // Verificar argumento de saída
    const outputArg = args.find(arg => arg.startsWith('--output='));
    if (outputArg) {
      outputPath = path.resolve(__dirname, outputArg.split('=')[1]);
    }
    
    log('Lendo arquivo markdown...', 'info');
    const markdown = readMarkdown(INPUT_MD);
    
    // Verificar se marked está instalado
    try {
      require('marked');
    } catch (e) {
      log('Instalando dependência marked...', 'info');
      require('child_process').execSync('npm install marked');
    }
    
    log('Gerando relatório PDF...', 'info');
    await generatePDF(markdown, outputPath);
    
    log('Relatório PDF gerado com sucesso!', 'success');
    
  } catch (error) {
    log(`Erro: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Executar script
if (require.main === module) {
  main().catch(console.error);
} 