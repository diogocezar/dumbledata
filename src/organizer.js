const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getFileDate, formatDate, getFileCategory, batchAnalyzeContexts } = require('./utils');

/**
 * Organiza os arquivos do diretório especificado, incluindo subpastas
 * @param {string} sourceDir - Diretório de origem
 * @param {boolean} recursive - Se deve processar subpastas
 */
async function organizeFiles(sourceDir, recursive = true) {
  console.log(chalk.cyan(`\n📂 Iniciando organização de arquivos em: ${sourceDir}`));
  
  // Criar diretório organizado
  const organizedDir = path.join(sourceDir, 'organized');
  await fs.ensureDir(organizedDir);
  console.log(chalk.gray(`🗂️  Diretório de destino criado: ${organizedDir}`));
  
  // Obter todos os arquivos do diretório e subdiretórios (se recursive=true)
  const filesToProcess = await getAllFiles(sourceDir, recursive);
  
  console.log(chalk.cyan(`🔎 Encontrados ${filesToProcess.length} arquivos para processar.`));
  
  if (filesToProcess.length === 0) {
    console.log(chalk.yellow('⚠️ Nenhum arquivo para processar.'));
    return;
  }
  
  // Analisar contextos em lote
  console.log(chalk.cyan('🧠 Analisando contextos dos arquivos...'));
  const contextMap = await batchAnalyzeContexts(filesToProcess.map(f => f.name));
  console.log(chalk.green('✅ Análise de contextos concluída.'));
  
  // Estatísticas
  let categoriesCreated = new Set();
  let contextsCreated = new Set();
  let filesProcessed = 0;
  
  // Processar cada arquivo com o contexto determinado
  for (const fileInfo of filesToProcess) {
    try {
      const { path: sourcePath, name: fileName } = fileInfo;
      
      // Obter informações do arquivo
      const fileDate = getFileDate(sourcePath);
      const formattedDate = formatDate(fileDate);
      const year = fileDate.getFullYear().toString();
      const category = getFileCategory(sourcePath);
      
      // Extrair nome e extensão
      const ext = path.extname(fileName);
      const baseName = path.basename(fileName, ext);
      
      // Obter o contexto do mapa de contextos
      const context = contextMap[fileName];
      if (!context) {
        // Cria uma categoria baseada no nome
        const cleanName = baseName.trim();
        const firstWord = cleanName.split(' ')[0];
        context = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      }
      
      // Criar estrutura de diretórios
      const categoryDir = path.join(organizedDir, category);
      const yearDir = path.join(categoryDir, year);
      const contextDir = path.join(yearDir, context);
      
      await fs.ensureDir(contextDir);
      
      // Novo nome de arquivo
      const newFileName = `${formattedDate}-${baseName}${ext}`;
      const destPath = path.join(contextDir, newFileName);
      
      // Copiar o arquivo (não mover)
      await fs.copy(sourcePath, destPath, { overwrite: false });
      
      // Atualizar estatísticas
      categoriesCreated.add(category);
      contextsCreated.add(context);
      filesProcessed++;
      
      console.log(chalk.green(`✅ Arquivo copiado: ${fileName}`));
      console.log(chalk.gray(`   📁 Destino: ${path.relative(sourceDir, destPath)}`));
      console.log(chalk.gray(`   🏷️  Contexto: ${context}`));
      console.log(chalk.gray(`   📍 Origem: ${path.relative(sourceDir, sourcePath)}`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Erro ao processar o arquivo ${fileInfo.name}: ${error.message}`));
    }
  }

  // Mostrar o output completo da IA
  console.log(chalk.magenta('\n🤖 Resposta completa da IA:'));
  console.log(chalk.gray('-----------------------------------'));
  console.log(chalk.white(JSON.stringify(contextMap, null, 2)));
  console.log(chalk.gray('-----------------------------------\n'));
  
  // Exibir estatísticas finais
  console.log(chalk.cyan('\n📊 Estatísticas da organização:'));
  console.log(chalk.cyan(`   📄 Arquivos processados: ${filesProcessed}`));
  console.log(chalk.cyan(`   📁 Categorias criadas: ${categoriesCreated.size}`));
  console.log(chalk.cyan(`   🏷️  Contextos identificados: ${contextsCreated.size}`));
}

/**
 * Obtém todos os arquivos de um diretório e suas subpastas (opcional)
 * @param {string} dir - Diretório a ser analisado
 * @param {boolean} recursive - Se deve analisar subpastas
 * @param {Array} results - Resultados acumulados (para uso interno)
 * @returns {Promise<Array>} - Lista de objetos com informações dos arquivos
 */
async function getAllFiles(dir, recursive = true, results = []) {
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);
    
    // Ignorar a pasta 'organized'
    if (item === 'organized') continue;
    
    if (stats.isDirectory()) {
      if (recursive) {
        // Recursivamente buscar arquivos em subpastas
        await getAllFiles(itemPath, recursive, results);
      }
    } else {
      // Adicionar arquivo à lista
      results.push({
        path: itemPath,
        name: item
      });
    }
  }
  
  return results;
}

module.exports = {
  organizeFiles
}; 