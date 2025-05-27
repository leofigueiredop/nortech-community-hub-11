// Script para gerar um relatório em formato Markdown sobre as estatísticas de código
// Uso: node generate-code-stats-report.js [--output=codigo-stats-report.md]
// Requer que o script code-stats.js tenha sido executado anteriormente

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { rgb } = require('pdf-lib');

// Configurações
const DEFAULT_OUTPUT = 'codigo-estatisticas.md';
const STATS_TEXT_FILE = path.resolve(__dirname, 'estatisticas-codigo.txt');

// Funções de utilidade
const formatPercentage = (value) => `${Math.round(value)}%`;
const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Verifica se o arquivo de estatísticas existe
function checkStatsFile() {
  if (!fs.existsSync(STATS_TEXT_FILE)) {
    console.log('⚠️ Arquivo de estatísticas não encontrado. Executando análise de código...');
    try {
      execSync('node code-stats.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Erro ao executar análise de código:', error.message);
      process.exit(1);
    }
  }
}

// Extrai informações do arquivo de estatísticas
function parseStatsFile() {
  const content = fs.readFileSync(STATS_TEXT_FILE, 'utf8');
  
  // Estatísticas gerais
  const totalFiles = parseInt(content.match(/Total de Arquivos: (\d+)/)[1]);
  const totalLines = parseInt(content.match(/Total de Linhas: (\d+)/)[1]);
  const codeLines = parseInt(content.match(/Linhas de Código: (\d+)/)[1]);
  const commentLines = parseInt(content.match(/Linhas de Comentário: (\d+)/)[1]);
  const blankLines = parseInt(content.match(/Linhas em Branco: (\d+)/)[1]);
  
  // Código original vs. adicionado
  const originalFiles = parseInt(content.match(/Código Original do Frontend:[\s\S]*?- Arquivos: (\d+)/)[1]);
  const originalLines = parseInt(content.match(/Código Original do Frontend:[\s\S]*?- Linhas Totais: (\d+)/)[1]);
  const originalCodeLines = parseInt(content.match(/Código Original do Frontend:[\s\S]*?- Linhas de Código: (\d+)/)[1]);
  
  const addedFiles = parseInt(content.match(/Código Adicionado\/Modificado:[\s\S]*?- Arquivos: (\d+)/)[1]);
  const addedLines = parseInt(content.match(/Código Adicionado\/Modificado:[\s\S]*?- Linhas Totais: (\d+)/)[1]);
  const addedCodeLines = parseInt(content.match(/Código Adicionado\/Modificado:[\s\S]*?- Linhas de Código: (\d+)/)[1]);
  
  // Estatísticas por tipo de arquivo
  const fileTypes = {};
  const fileTypeRegex = /\.([a-z]+):\s+- Arquivos: (\d+)\s+- Linhas Totais: (\d+) \((\d+)%\)\s+- Linhas de Código: (\d+)/g;
  let match;
  
  while ((match = fileTypeRegex.exec(content)) !== null) {
    const extension = match[1];
    fileTypes[extension] = {
      files: parseInt(match[2]),
      lines: parseInt(match[3]),
      percentage: parseInt(match[4]),
      codeLines: parseInt(match[5])
    };
  }
  
  return {
    general: {
      totalFiles,
      totalLines,
      codeLines,
      commentLines,
      blankLines
    },
    comparison: {
      original: {
        files: originalFiles,
        lines: originalLines,
        codeLines: originalCodeLines
      },
      added: {
        files: addedFiles,
        lines: addedLines,
        codeLines: addedCodeLines
      }
    },
    fileTypes
  };
}

// Gera o relatório em formato Markdown
function generateMarkdownReport(stats) {
  const { general, comparison, fileTypes } = stats;
  
  let markdown = `# Relatório de Estatísticas de Código - Nortech Community Hub

## Resumo Executivo

Este relatório apresenta uma análise detalhada do código-fonte do projeto Nortech Community Hub, com foco na distribuição entre código original do frontend e código adicionado/modificado durante a implementação da conexão com o Supabase.

**Estatísticas Principais:**
- **Total de Arquivos**: ${formatNumber(general.totalFiles)}
- **Total de Linhas de Código**: ${formatNumber(general.codeLines)} (${formatPercentage(general.codeLines / general.totalLines * 100)} do total)
- **Código Original**: ${formatNumber(comparison.original.lines)} linhas (${formatPercentage(comparison.original.lines / general.totalLines * 100)})
- **Código Adicionado**: ${formatNumber(comparison.added.lines)} linhas (${formatPercentage(comparison.added.lines / general.totalLines * 100)})

## Visão Geral do Código

A análise do código-fonte revela que **${formatPercentage(comparison.added.lines / general.totalLines * 100)}** do código atual foi desenvolvido especificamente para este projeto, enquanto **${formatPercentage(comparison.original.lines / general.totalLines * 100)}** é proveniente do frontend original, incluindo componentes reutilizáveis e bibliotecas.

![Gráfico de Distribuição de Código](https://quickchart.io/chart?c={type:'pie',data:{labels:['Código Original','Código Adicionado'],datasets:[{data:[${comparison.original.lines},${comparison.added.lines}],backgroundColor:['%2334A853','%234285F4']}]},options:{plugins:{datalabels:{formatter:function(value,context){return context.chart.data.labels[context.dataIndex]+': '+Math.round(value/${general.totalLines}*100)+'%'},color:'white',font:{weight:'bold',size:14}}}}})

## Estatísticas Detalhadas

### Composição do Código

| Tipo | Linhas | Percentual |
|------|--------|------------|
| Código (instruções) | ${formatNumber(general.codeLines)} | ${formatPercentage(general.codeLines / general.totalLines * 100)} |
| Comentários | ${formatNumber(general.commentLines)} | ${formatPercentage(general.commentLines / general.totalLines * 100)} |
| Linhas em branco | ${formatNumber(general.blankLines)} | ${formatPercentage(general.blankLines / general.totalLines * 100)} |
| **Total** | **${formatNumber(general.totalLines)}** | **100%** |

### Comparação de Arquivos

| Categoria | Arquivos | Percentual | Linhas | Percentual |
|-----------|----------|------------|--------|------------|
| Código Original | ${formatNumber(comparison.original.files)} | ${formatPercentage(comparison.original.files / general.totalFiles * 100)} | ${formatNumber(comparison.original.lines)} | ${formatPercentage(comparison.original.lines / general.totalLines * 100)} |
| Código Adicionado | ${formatNumber(comparison.added.files)} | ${formatPercentage(comparison.added.files / general.totalFiles * 100)} | ${formatNumber(comparison.added.lines)} | ${formatPercentage(comparison.added.lines / general.totalLines * 100)} |
| **Total** | **${formatNumber(general.totalFiles)}** | **100%** | **${formatNumber(general.totalLines)}** | **100%** |

![Gráfico de Arquivos vs. Código](https://quickchart.io/chart?c={type:'bar',data:{labels:['Arquivos','Linhas de Código'],datasets:[{label:'Original',backgroundColor:'%2334A853',data:[${comparison.original.files},${comparison.original.lines}]},{label:'Adicionado',backgroundColor:'%234285F4',data:[${comparison.added.files},${comparison.added.lines}]}]},options:{plugins:{datalabels:{display:true,formatter:function(value,context){return Math.round(value/(context.dataIndex===0?${general.totalFiles}:${general.totalLines})*100)+'%'},color:'white',font:{weight:'bold'}}},scales:{x:{stacked:false},y:{stacked:false}}}})

### Tipos de Arquivo

A distribuição do código por tipos de arquivo é a seguinte:

| Extensão | Arquivos | Linhas | Percentual |
|----------|----------|--------|------------|
${Object.entries(fileTypes)
    .sort((a, b) => b[1].lines - a[1].lines)
    .map(([ext, data]) => `| .${ext} | ${formatNumber(data.files)} | ${formatNumber(data.lines)} | ${formatPercentage(data.percentage)} |`)
    .join('\n')}

## Análise de Desenvolvimento

Baseado nestes números, podemos concluir que:

1. **Grande Volume de Código Novo**: Aproximadamente ${formatPercentage(comparison.added.lines / general.totalLines * 100)} do código foi adicionado especificamente para este projeto, representando um esforço significativo de desenvolvimento.

2. **Reutilização Eficiente**: Cerca de ${formatPercentage(comparison.original.lines / general.totalLines * 100)} do código aproveita componentes e estruturas existentes, o que ajudou a acelerar o desenvolvimento mantendo padrões de qualidade.

3. **Predominância de TypeScript React**: ${Object.keys(fileTypes).includes('tsx') ? formatPercentage(fileTypes['tsx'].lines / general.totalLines * 100) : '0%'} do código está em arquivos .tsx, indicando o uso intensivo de React com TypeScript para a interface do usuário.

4. **Código Bem Estruturado**: A proporção de ${formatPercentage(general.blankLines / general.totalLines * 100)} de linhas em branco e ${formatPercentage(general.commentLines / general.totalLines * 100)} de comentários sugere um código bem formatado e documentado.

## Conclusão

O projeto Nortech Community Hub demonstra um equilíbrio saudável entre código reutilizado e desenvolvimento específico. A maior parte do esforço de desenvolvimento (${formatPercentage(comparison.added.lines / general.totalLines * 100)}) foi direcionada para a criação de novas funcionalidades e integração com o Supabase, enquanto aproveita eficientemente os componentes de UI e estruturas existentes (${formatPercentage(comparison.original.lines / general.totalLines * 100)}).

Esta análise quantitativa complementa os relatórios qualitativos anteriores sobre o status de conexão com o Supabase, fornecendo uma visão abrangente do estado atual do desenvolvimento do projeto.

---

*Relatório gerado automaticamente em ${new Date().toLocaleString()} utilizando o script code-stats.js*
`;

  return markdown;
}

// Função principal
async function main() {
  try {
    // Analisar argumentos de linha de comando
    const args = process.argv.slice(2);
    let outputFile = DEFAULT_OUTPUT;
    let generatePdf = false;
    let pdfOutputFile = 'codigo-estatisticas.pdf';
    
    // Verificar argumentos
    const outputArg = args.find(arg => arg.startsWith('--output='));
    if (outputArg) {
      outputFile = outputArg.split('=')[1];
    }
    
    const pdfArg = args.find(arg => arg === '--pdf' || arg.startsWith('--pdf='));
    if (pdfArg) {
      generatePdf = true;
      if (pdfArg.startsWith('--pdf=')) {
        pdfOutputFile = pdfArg.split('=')[1];
      } else {
        // Se a extensão do arquivo de saída é .md, substitua por .pdf
        if (outputFile.endsWith('.md')) {
          pdfOutputFile = outputFile.replace(/\.md$/, '.pdf');
        }
      }
    }
    
    console.log('📊 Gerando relatório de estatísticas de código...');
    
    // Verificar se temos os dados de estatísticas
    checkStatsFile();
    
    // Carregar e analisar os dados
    const stats = parseStatsFile();
    
    // Verificação adicional: confirmar que os valores fazem sentido
    console.log('📋 Estatísticas carregadas:');
    console.log(`- Total: ${stats.general.totalLines} linhas`);
    console.log(`- Original: ${stats.comparison.original.lines} linhas (${Math.round(stats.comparison.original.lines/stats.general.totalLines*100)}%)`);
    console.log(`- Adicionado: ${stats.comparison.added.lines} linhas (${Math.round(stats.comparison.added.lines/stats.general.totalLines*100)}%)`);
    
    // Verificar se a soma está correta
    const soma = stats.comparison.original.lines + stats.comparison.added.lines;
    if (Math.abs(soma - stats.general.totalLines) > 10) { // Tolerância de 10 linhas para arredondamentos
      console.warn(`⚠️ Aviso: A soma das linhas (${soma}) não corresponde ao total (${stats.general.totalLines})`);
    }
    
    // Gerar relatório Markdown
    const markdown = generateMarkdownReport(stats);
    
    // Salvar relatório no arquivo
    fs.writeFileSync(outputFile, markdown);
    
    console.log(`✅ Relatório de estatísticas gerado com sucesso: ${outputFile}`);
    
    // Gerar PDF diretamente com pdf-lib se solicitado
    if (generatePdf) {
      console.log(`📄 Gerando relatório em PDF: ${pdfOutputFile}`);
      await generatePdfFromStats(stats, pdfOutputFile);
      console.log(`✅ Relatório PDF gerado com sucesso: ${pdfOutputFile}`);
    }
    
    // Verificar se temos pandoc para converter para outros formatos, se necessário
    try {
      const hasPandoc = execSync('which pandoc', { stdio: 'pipe' }).toString().trim();
      
      if (hasPandoc && !generatePdf) {
        console.log('📝 Pandoc encontrado! Você pode converter o relatório para outros formatos.');
        console.log('   Exemplo: pandoc -s codigo-estatisticas.md -o codigo-estatisticas.pdf');
        console.log('   Ou execute este script com o parâmetro --pdf para gerar o PDF diretamente.');
      }
    } catch (e) {
      // Não temos pandoc, sem problema
      if (!generatePdf) {
        console.log('📄 Você pode gerar um PDF diretamente executando este script com o parâmetro --pdf');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Função para gerar PDF diretamente com pdf-lib
async function generatePdfFromStats(stats, outputPath) {
  try {
    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Definir metadados do documento
    pdfDoc.setTitle('Estatísticas de Código - Nortech Community Hub');
    pdfDoc.setAuthor('Sistema de Análise de Código');
    pdfDoc.setSubject('Análise de Linhas de Código');
    pdfDoc.setKeywords(['nortech', 'estatísticas', 'código', 'análise', 'linhas']);
    
    // Configuração de página - A4 Retrato
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const MARGIN_LEFT = 50;
    const MARGIN_RIGHT = 50;
    const MARGIN_TOP = 50;
    const MARGIN_BOTTOM = 50;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    
    // Carregar fontes
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    // Funções auxiliares para desenho
    const drawTitle = (page, text, y, size = 16) => {
      page.drawText(text, {
        x: MARGIN_LEFT,
        y,
        size,
        font: helveticaBold,
        color: rgb(0, 0, 0.8)
      });
      return y - size - 10;
    };
    
    const drawText = (page, text, y, size = 12, indent = 0) => {
      page.drawText(text, {
        x: MARGIN_LEFT + indent,
        y,
        size,
        font: helveticaFont,
        color: rgb(0, 0, 0.7)
      });
      return y - size - 5;
    };
    
    const drawPieChart = (page, y, original, added, total) => {
      const centerX = MARGIN_LEFT + CONTENT_WIDTH / 2;
      const centerY = y - 100;
      const radius = 80;
      
      // Calcular percentuais
      const originalPercent = original / total;
      const addedPercent = added / total;
      
      // Em vez de desenhar um círculo de pizza, vamos desenhar dois retângulos
      // representando a proporção de código original vs adicionado
      const barHeight = 40;
      const barWidth = CONTENT_WIDTH;
      
      // Código adicionado (azul)
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: centerY,
        width: barWidth,
        height: barHeight,
        color: rgb(0.3, 0.4, 0.8) // Azul para código adicionado
      });
      
      // Sobrepor segmento para código original (verde)
      if (originalPercent > 0.001) { // Evitar segmentos muito pequenos
        page.drawRectangle({
          x: MARGIN_LEFT,
          y: centerY,
          width: barWidth * originalPercent,
          height: barHeight,
          color: rgb(0.2, 0.6, 0.3) // Verde para código original
        });
      }
      
      // Legendas
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: centerY - 60,
        width: 10,
        height: 10,
        color: rgb(0.2, 0.6, 0.3)
      });
      
      page.drawText(`Código Original: ${formatNumber(original)} linhas (${formatPercentage(originalPercent * 100)})`, {
        x: MARGIN_LEFT + 20,
        y: centerY - 55,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0.7)
      });
      
      page.drawRectangle({
        x: MARGIN_LEFT + 200,
        y: centerY - 60,
        width: 10,
        height: 10,
        color: rgb(0.3, 0.4, 0.8)
      });
      
      page.drawText(`Código Adicionado: ${formatNumber(added)} linhas (${formatPercentage(addedPercent * 100)})`, {
        x: MARGIN_LEFT + 220,
        y: centerY - 55,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0.7)
      });
      
      // Desenhar marcadores de porcentagem acima da barra
      const positions = [0.25, 0.5, 0.75];
      for (const pos of positions) {
        // Linha vertical
        page.drawLine({
          start: { x: MARGIN_LEFT + barWidth * pos, y: centerY - 5 },
          end: { x: MARGIN_LEFT + barWidth * pos, y: centerY + barHeight + 5 },
          thickness: 0.5,
          color: rgb(0, 0, 0.5),
        });
        
        // Valor percentual
        page.drawText(`${Math.round(pos * 100)}%`, {
          x: MARGIN_LEFT + barWidth * pos - 10,
          y: centerY + barHeight + 15,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0.5)
        });
      }
      
      return centerY - 100;
    };
    
    const drawBarChart = (page, y, data, labels) => {
      const chartWidth = CONTENT_WIDTH;
      const chartHeight = 120;
      const barCount = data.length;
      const barWidth = chartWidth / (barCount * 2);
      const maxValue = Math.max(...data);
      
      // Desenhar barras
      for (let i = 0; i < barCount; i++) {
        const barHeight = (data[i] / maxValue) * chartHeight;
        const barX = MARGIN_LEFT + i * (barWidth * 2) + barWidth / 2;
        const barY = y - chartHeight;
        
        // Barra
        page.drawRectangle({
          x: barX,
          y: barY,
          width: barWidth,
          height: barHeight,
          color: rgb(0.3, 0.5, 0.7)
        });
        
        // Valor
        page.drawText(formatNumber(data[i]), {
          x: barX - 5,
          y: barY + barHeight + 10,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0.7)
        });
        
        // Rótulo
        page.drawText(labels[i], {
          x: barX - 10,
          y: barY - 15,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0.7)
        });
      }
      
      return barY - 30;
    };
    
    const drawTable = (page, y, headers, rows, columnWidths) => {
      const rowHeight = 25;
      let currentY = y;
      
      // Cabeçalho
      let x = MARGIN_LEFT;
      for (let i = 0; i < headers.length; i++) {
        page.drawText(headers[i], {
          x,
          y: currentY,
          size: 10,
          font: helveticaBold,
          color: rgb(0, 0, 0.8)
        });
        x += columnWidths[i];
      }
      
      currentY -= 15;
      
      // Linha horizontal após cabeçalho
      page.drawLine({
        start: { x: MARGIN_LEFT, y: currentY + 5 },
        end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: currentY + 5 },
        thickness: 1,
        color: rgb(0, 0, 0.5),
      });
      
      // Linhas de dados
      for (const row of rows) {
        currentY -= rowHeight;
        
        // Verificar se precisamos de nova página
        if (currentY < MARGIN_BOTTOM + 30) {
          // Adicionar nova página
          const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          
          // Adicionar cabeçalho à nova página
          newPage.drawText('Estatísticas de Código - Nortech Community Hub (continuação)', {
            x: MARGIN_LEFT,
            y: PAGE_HEIGHT - MARGIN_TOP,
            size: 12,
            font: helveticaBold,
            color: rgb(0, 0, 0.8)
          });
          
          currentY = PAGE_HEIGHT - MARGIN_TOP - 40;
          page = newPage;
          
          // Redesenhar cabeçalho da tabela
          x = MARGIN_LEFT;
          for (let i = 0; i < headers.length; i++) {
            page.drawText(headers[i], {
              x,
              y: currentY,
              size: 10,
              font: helveticaBold,
              color: rgb(0, 0, 0.8)
            });
            x += columnWidths[i];
          }
          
          currentY -= 15;
          
          // Linha horizontal após cabeçalho
          page.drawLine({
            start: { x: MARGIN_LEFT, y: currentY + 5 },
            end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: currentY + 5 },
            thickness: 1,
            color: rgb(0, 0, 0.5),
          });
        }
        
        // Desenhar células
        x = MARGIN_LEFT;
        for (let i = 0; i < row.length; i++) {
          page.drawText(row[i], {
            x,
            y: currentY + 5,
            size: 10,
            font: i === 0 ? helveticaBold : helveticaFont,
            color: rgb(0, 0, 0.7)
          });
          x += columnWidths[i];
        }
        
        // Linha horizontal após cada linha (exceto a última)
        if (rows.indexOf(row) < rows.length - 1) {
          page.drawLine({
            start: { x: MARGIN_LEFT, y: currentY - 5 },
            end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: currentY - 5 },
            thickness: 0.5,
            color: rgb(0, 0, 0.2),
          });
        }
      }
      
      return currentY - 20;
    };
    
    // Criar primeira página (capa)
    const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título principal
    let y = PAGE_HEIGHT - MARGIN_TOP;
    y = drawTitle(coverPage, 'ESTATÍSTICAS DE CÓDIGO', y, 24);
    y = drawTitle(coverPage, 'Nortech Community Hub', y, 18);
    y -= 20;
    
    // Data e informações gerais
    y = drawText(coverPage, `Análise realizada em: ${new Date().toLocaleString()}`, y, 12);
    y -= 20;
    
    // Sumário executivo
    y = drawTitle(coverPage, 'Resumo Executivo', y);
    y -= 10;
    
    y = drawText(coverPage, 'Este relatório apresenta uma análise detalhada do código-fonte do projeto Nortech', y);
    y = drawText(coverPage, 'Community Hub, com foco na distribuição entre código original do frontend e', y);
    y = drawText(coverPage, 'código adicionado durante a implementação da conexão com o Supabase.', y);
    y -= 20;
    
    // Estatísticas principais
    y = drawTitle(coverPage, 'Estatísticas Principais', y, 14);
    y -= 5;
    
    y = drawText(coverPage, `• Total de Arquivos: ${formatNumber(stats.general.totalFiles)}`, y);
    y = drawText(coverPage, `• Total de Linhas: ${formatNumber(stats.general.totalLines)}`, y);
    y = drawText(coverPage, `• Linhas de Código: ${formatNumber(stats.general.codeLines)} (${formatPercentage(stats.general.codeLines / stats.general.totalLines * 100)})`, y);
    y = drawText(coverPage, `• Código Original: ${formatNumber(stats.comparison.original.lines)} linhas (${formatPercentage(stats.comparison.original.lines / stats.general.totalLines * 100)})`, y);
    y = drawText(coverPage, `• Código Adicionado: ${formatNumber(stats.comparison.added.lines)} linhas (${formatPercentage(stats.comparison.added.lines / stats.general.totalLines * 100)})`, y);
    y -= 20;
    
    // Gráfico de pizza
    y = drawPieChart(
      coverPage, 
      y, 
      stats.comparison.original.lines, 
      stats.comparison.added.lines, 
      stats.general.totalLines
    );
    
    // Página de estatísticas detalhadas
    const detailsPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título
    y = PAGE_HEIGHT - MARGIN_TOP;
    y = drawTitle(detailsPage, 'Estatísticas Detalhadas', y, 18);
    y -= 10;
    
    // Tabela de composição do código
    y = drawTitle(detailsPage, 'Composição do Código', y, 14);
    y -= 10;
    
    y = drawTable(
      detailsPage,
      y,
      ['Tipo', 'Linhas', 'Percentual'],
      [
        ['Código (instruções)', formatNumber(stats.general.codeLines), formatPercentage(stats.general.codeLines / stats.general.totalLines * 100)],
        ['Comentários', formatNumber(stats.general.commentLines), formatPercentage(stats.general.commentLines / stats.general.totalLines * 100)],
        ['Linhas em branco', formatNumber(stats.general.blankLines), formatPercentage(stats.general.blankLines / stats.general.totalLines * 100)],
        ['Total', formatNumber(stats.general.totalLines), '100%']
      ],
      [150, 100, 100]
    );
    y -= 30;
    
    // Tabela de comparação de arquivos
    y = drawTitle(detailsPage, 'Comparação de Arquivos', y, 14);
    y -= 10;
    
    y = drawTable(
      detailsPage,
      y,
      ['Categoria', 'Arquivos', '%', 'Linhas', '%'],
      [
        [
          'Código Original', 
          formatNumber(stats.comparison.original.files), 
          formatPercentage(stats.comparison.original.files / stats.general.totalFiles * 100),
          formatNumber(stats.comparison.original.lines),
          formatPercentage(stats.comparison.original.lines / stats.general.totalLines * 100)
        ],
        [
          'Código Adicionado', 
          formatNumber(stats.comparison.added.files), 
          formatPercentage(stats.comparison.added.files / stats.general.totalFiles * 100),
          formatNumber(stats.comparison.added.lines),
          formatPercentage(stats.comparison.added.lines / stats.general.totalLines * 100)
        ],
        [
          'Total', 
          formatNumber(stats.general.totalFiles), 
          '100%',
          formatNumber(stats.general.totalLines),
          '100%'
        ]
      ],
      [120, 80, 50, 80, 50]
    );
    y -= 30;
    
    // Tipos de arquivo
    y = drawTitle(detailsPage, 'Tipos de Arquivo', y, 14);
    y -= 10;
    
    // Preparar dados para tabela de tipos de arquivo
    const fileTypesRows = Object.entries(stats.fileTypes)
      .sort((a, b) => b[1].lines - a[1].lines)
      .map(([ext, data]) => [
        `.${ext}`,
        formatNumber(data.files),
        formatNumber(data.lines),
        formatPercentage(data.percentage)
      ]);
    
    // Adicionar linha de total
    fileTypesRows.push([
      'Total',
      formatNumber(stats.general.totalFiles),
      formatNumber(stats.general.totalLines),
      '100%'
    ]);
    
    y = drawTable(
      detailsPage,
      y,
      ['Extensão', 'Arquivos', 'Linhas', '%'],
      fileTypesRows,
      [100, 80, 100, 80]
    );
    
    // Página de conclusões
    const conclusionPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Título
    y = PAGE_HEIGHT - MARGIN_TOP;
    y = drawTitle(conclusionPage, 'Análise e Conclusões', y, 18);
    y -= 20;
    
    // Conclusões
    y = drawTitle(conclusionPage, '1. Grande Volume de Código Novo', y, 14);
    y -= 5;
    y = drawText(conclusionPage, `Aproximadamente ${formatPercentage(stats.comparison.added.lines / stats.general.totalLines * 100)} do código foi adicionado`, y);
    y = drawText(conclusionPage, 'especificamente para este projeto, representando um esforço significativo', y);
    y = drawText(conclusionPage, 'de desenvolvimento para a integração com o Supabase.', y);
    y -= 15;
    
    y = drawTitle(conclusionPage, '2. Reutilização Eficiente', y, 14);
    y -= 5;
    y = drawText(conclusionPage, `Cerca de ${formatPercentage(stats.comparison.original.lines / stats.general.totalLines * 100)} do código aproveita componentes e estruturas existentes,`, y);
    y = drawText(conclusionPage, 'o que ajudou a acelerar o desenvolvimento mantendo padrões de qualidade.', y);
    y -= 15;
    
    y = drawTitle(conclusionPage, '3. Predominância de TypeScript React', y, 14);
    y -= 5;
    y = drawText(conclusionPage, `${Object.keys(stats.fileTypes).includes('tsx') ? formatPercentage(stats.fileTypes['tsx'].lines / stats.general.totalLines * 100) : '0%'} do código está em arquivos .tsx, indicando o uso intensivo de`, y);
    y = drawText(conclusionPage, 'React com TypeScript para a interface do usuário.', y);
    y -= 15;
    
    y = drawTitle(conclusionPage, '4. Código Bem Estruturado', y, 14);
    y -= 5;
    y = drawText(conclusionPage, `A proporção de ${formatPercentage(stats.general.blankLines / stats.general.totalLines * 100)} de linhas em branco e ${formatPercentage(stats.general.commentLines / stats.general.totalLines * 100)} de comentários`, y);
    y = drawText(conclusionPage, 'sugere um código bem formatado e documentado.', y);
    y -= 30;
    
    // Conclusão final
    y = drawTitle(conclusionPage, 'Conclusão', y, 16);
    y -= 15;
    
    y = drawText(conclusionPage, 'O projeto Nortech Community Hub demonstra um equilíbrio saudável entre código', y);
    y = drawText(conclusionPage, 'reutilizado e desenvolvimento específico. A maior parte do esforço de desenvolvimento', y);
    y = drawText(conclusionPage, `(${formatPercentage(stats.comparison.added.lines / stats.general.totalLines * 100)}) foi direcionada para a criação de novas funcionalidades e integração`, y);
    y = drawText(conclusionPage, 'com o Supabase, enquanto aproveita eficientemente os componentes de UI e estruturas', y);
    y = drawText(conclusionPage, `existentes (${formatPercentage(stats.comparison.original.lines / stats.general.totalLines * 100)}).`, y);
    y -= 15;
    
    y = drawText(conclusionPage, 'Esta análise quantitativa complementa os relatórios qualitativos anteriores sobre', y);
    y = drawText(conclusionPage, 'o status de conexão com o Supabase, fornecendo uma visão abrangente do estado', y);
    y = drawText(conclusionPage, 'atual do desenvolvimento do projeto.', y);
    
    // Rodapé em todas as páginas
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // Número da página
      page.drawText(`${i + 1} / ${pages.length}`, {
        x: PAGE_WIDTH - MARGIN_RIGHT - 40,
        y: MARGIN_BOTTOM - 15,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0.5)
      });
      
      // Data de geração
      page.drawText(`Gerado em: ${new Date().toLocaleString()}`, {
        x: MARGIN_LEFT,
        y: MARGIN_BOTTOM - 15,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0.5)
      });
    }
    
    // Salvar o PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    return outputPath;
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
    throw error;
  }
}

// Executar o script
if (require.main === module) {
  main().catch(console.error);
} 