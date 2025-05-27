// Script para executar as jornadas de teste
// Uso: node run-journeys.js [--owner] [--user] [--all]

const { runOwnerJourney } = require('./owner-journey');
const { runUserJourney } = require('./user-journey');

// Analisar argumentos
const args = process.argv.slice(2);
const runOwner = args.includes('--owner') || args.includes('--all');
const runUser = args.includes('--user') || args.includes('--all');
const shouldRunAll = args.includes('--all') || (!runOwner && !runUser);

console.log('┌────────────────────────────────────────────────────────────┐');
console.log('│           TESTE DE JORNADAS - NORTECH COMMUNITY HUB        │');
console.log('└────────────────────────────────────────────────────────────┘');

async function main() {
  if (shouldRunAll || runOwner) {
    console.log('\n🚀 Iniciando jornada do OWNER (proprietário da comunidade)...\n');
    await runOwnerJourney()
      .then(() => console.log('\n✅ Jornada do OWNER concluída com sucesso!\n'))
      .catch(error => console.error(`\n❌ Erro na jornada do OWNER: ${error.message}\n`));
  }
  
  if (shouldRunAll || runUser) {
    console.log('\n🚀 Iniciando jornada do USER (membro da comunidade)...\n');
    await runUserJourney(runOwner || shouldRunAll) // Skip owner journey if already ran
      .then(() => console.log('\n✅ Jornada do USER concluída com sucesso!\n'))
      .catch(error => console.error(`\n❌ Erro na jornada do USER: ${error.message}\n`));
  }
  
  console.log('\n📝 Resumo dos testes:');
  console.log('  - As capturas de tela foram salvas em: ./screenshots/');
  console.log('  - Os vídeos foram salvos em: ./videos/');
  console.log('\n📊 Use os arquivos gerados para documentação ou análise das jornadas de usuário.\n');
}

main().catch(console.error); 