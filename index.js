#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { organizeFiles } = require('./src/organizer');
const { validateDirectory } = require('./src/utils');
const { version } = require('./package.json');

// Configuração do CLI
program
  .version(version)
  .description('🧙‍♂️ DumbleData - Organizador de arquivos inteligente')
  .argument('[directory]', 'Diretório a ser organizado')
  .option('-y, --yes', 'Pular confirmações')
  .option('-r, --recursive', 'Processar subpastas recursivamente', true)
  .action(async (directory, options) => {
    try {
      console.log(chalk.cyan('🧙‍♂️ Bem-vindo ao DumbleData - Seu assistente mágico para organização de arquivos!'));
      
      // Se o diretório não for fornecido, pergunte ao usuário
      let targetDir = directory;
      if (!targetDir) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'directory',
            message: '📁 Qual diretório você deseja organizar?',
            default: process.cwd(),
            validate: validateDirectory
          }
        ]);
        targetDir = answer.directory;
      } else {
        // Validar o diretório fornecido
        if (!validateDirectory(targetDir)) {
          console.error(chalk.red(`❌ Erro: O diretório "${targetDir}" não existe ou não é acessível.`));
          process.exit(1);
        }
      }

      // Confirmar a operação
      if (!options.yes) {
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: `🔮 Você está prestes a organizar os arquivos em "${targetDir}". Continuar?`,
            default: false
          }
        ]);

        if (!confirm.proceed) {
          console.log(chalk.yellow('🛑 Operação cancelada pelo usuário.'));
          process.exit(0);
        }
      }

      // Iniciar o processo de organização
      const spinner = ora('🔍 Analisando arquivos...').start();
      await organizeFiles(targetDir, options.recursive);
      spinner.succeed('✨ Arquivos organizados com sucesso!');
      
      console.log(chalk.green('\n📦 Todos os arquivos foram copiados para a pasta "organized".'));
      console.log(chalk.blue('🔒 Os arquivos originais permanecem intactos.'));
      console.log(chalk.cyan('🧙‍♂️ Obrigado por usar o DumbleData!'));
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Erro: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv); 