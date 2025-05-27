// Script para gerar um relatório de saúde do sistema
// Executar com: node generate-report.js

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configurações
const REPORT_PATH = path.join(__dirname, 'system-health-report.html');
const DATE = new Date().toLocaleString();

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

// Função para capturar a saída de um comando
function captureOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    return `Erro ao executar ${command}: ${error.message}`;
  }
}

// Função principal
async function generateReport() {
  log('Gerando relatório de saúde do sistema...', 'info');
  
  // 1. Obter dados do sistema
  const healthCheckOutput = captureOutput('node app-healthcheck.js');
  const dataIntegrityOutput = captureOutput('node data-integrity-check.js');
  
  // 2. Obter informações adicionais
  const nodeVersion = process.version;
  const npmVersion = captureOutput('npm -v').trim();
  const repoInfo = {
    url: 'https://github.com/seu-usuario/nortech-community-hub',
    branch: captureOutput('git branch --show-current 2>/dev/null || echo "N/A"').trim(),
    lastCommit: captureOutput('git log -1 --pretty=%B 2>/dev/null || echo "N/A"').trim()
  };
  
  // 3. Gerar HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Saúde do Sistema - Nortech Community Hub</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      background-color: #6C5DD3;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    h1, h2, h3 {
      margin-top: 0;
    }
    .report-date {
      font-style: italic;
      margin-bottom: 0;
    }
    .section {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e9ecef;
    }
    .output {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      white-space: pre-wrap;
      font-family: monospace;
      border: 1px solid #ddd;
    }
    .success {
      color: #28a745;
    }
    .warning {
      color: #ffc107;
    }
    .error {
      color: #dc3545;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    footer {
      text-align: center;
      margin-top: 30px;
      color: #6c757d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Relatório de Saúde do Sistema</h1>
      <h2>Nortech Community Hub</h2>
      <p class="report-date">Gerado em: ${DATE}</p>
    </header>
    
    <div class="section">
      <h2>Informações do Sistema</h2>
      <table>
        <tr>
          <th>Node.js</th>
          <td>${nodeVersion}</td>
        </tr>
        <tr>
          <th>NPM</th>
          <td>${npmVersion}</td>
        </tr>
        <tr>
          <th>Repositório</th>
          <td>${repoInfo.url}</td>
        </tr>
        <tr>
          <th>Branch</th>
          <td>${repoInfo.branch}</td>
        </tr>
        <tr>
          <th>Último Commit</th>
          <td>${repoInfo.lastCommit}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h2>Verificação de Saúde da Aplicação</h2>
      <div class="output">${healthCheckOutput.replace(/✅/g, '<span class="success">✅</span>')
                                          .replace(/⚠️/g, '<span class="warning">⚠️</span>')
                                          .replace(/❌/g, '<span class="error">❌</span>')}</div>
    </div>
    
    <div class="section">
      <h2>Verificação de Integridade de Dados</h2>
      <div class="output">${dataIntegrityOutput.replace(/✅/g, '<span class="success">✅</span>')
                                             .replace(/⚠️/g, '<span class="warning">⚠️</span>')
                                             .replace(/❌/g, '<span class="error">❌</span>')}</div>
    </div>
    
    <div class="section">
      <h2>Recomendações</h2>
      <ul>
        <li>Resolver quaisquer erros indicados nos relatórios acima.</li>
        <li>Verificar a conectividade com o Supabase e credenciais de API.</li>
        <li>Manter backups regulares do banco de dados.</li>
        <li>Monitorar o uso de recursos no servidor.</li>
      </ul>
    </div>
    
    <footer>
      &copy; ${new Date().getFullYear()} Nortech Community Hub - Relatório de Saúde do Sistema
    </footer>
  </div>
</body>
</html>
  `;
  
  // 4. Salvar o relatório
  fs.writeFileSync(REPORT_PATH, htmlContent);
  
  log(`Relatório gerado com sucesso em: ${REPORT_PATH}`, 'success');
  
  // 5. Retornar o caminho do relatório
  return REPORT_PATH;
}

// Executar geração do relatório
generateReport().catch(error => {
  log(`Erro ao gerar relatório: ${error.message}`, 'error');
  console.error(error);
}); 