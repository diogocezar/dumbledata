const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const axios = require('axios');
const chalk = require('chalk');

/**
 * Valida se um diretório existe e é acessível
 * @param {string} directory - Caminho do diretório
 * @returns {boolean} - Verdadeiro se o diretório for válido
 */
function validateDirectory(directory) {
  try {
    return fs.existsSync(directory) && fs.statSync(directory).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Obtém a data de criação de um arquivo
 * @param {string} filePath - Caminho do arquivo
 * @returns {Date} - Data de criação
 */
function getFileDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    // Tenta usar a data de criação, se não disponível usa a data de modificação
    return stats.birthtime || stats.mtime;
  } catch (error) {
    return new Date();
  }
}

/**
 * Formata uma data no padrão YYYYMMDD
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Determina a categoria de um arquivo com base no tipo MIME e extensão
 * @param {string} filePath - Caminho do arquivo
 * @returns {string} - Categoria do arquivo
 */
function getFileCategory(filePath) {
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  const ext = path.extname(filePath).toLowerCase();
  
  // Imagens
  if (mimeType.startsWith('image/')) return 'Imagens';
  
  // Vídeos
  if (mimeType.startsWith('video/') || 
      ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm', '.m4v', '.3gp'].includes(ext)) 
    return 'Vídeos';
  
  // Áudio
  if (mimeType.startsWith('audio/') || 
      ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.wma', '.m4a', '.aiff'].includes(ext)) 
    return 'Músicas';
  
  // Documentos
  const documentExts = [
    // Documentos de texto
    '.doc', '.docx', '.odt', '.rtf', '.txt', '.md', '.tex',
    // Planilhas
    '.xls', '.xlsx', '.ods', '.csv',
    // Apresentações
    '.ppt', '.pptx', '.odp', '.key',
    // Outros documentos
    '.pdf', '.epub', '.mobi'
  ];
  
  if (documentExts.includes(ext) || mimeType === 'application/pdf') {
    // Subcategorias de documentos
    if (['.pdf'].includes(ext)) return 'PDFs';
    if (['.xls', '.xlsx', '.ods', '.csv'].includes(ext)) return 'Planilhas';
    if (['.ppt', '.pptx', '.odp', '.key'].includes(ext)) return 'Apresentações';
    if (['.epub', '.mobi'].includes(ext)) return 'E-books';
    return 'Documentos';
  }
  
  // Arquivos compactados
  const compressedExts = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso'];
  if (compressedExts.includes(ext)) return 'Arquivos Compactados';
  
  // Código-fonte e scripts
  const codeExts = [
    // Web
    '.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.php', '.asp', '.aspx', '.jsp',
    // Programação
    '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.pl', '.swift', '.kt',
    // Scripts e configuração
    '.sh', '.bat', '.ps1', '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.conf'
  ];
  if (codeExts.includes(ext)) return 'Código-fonte';
  
  // Instaladores
  const installerExts = ['.exe', '.msi', '.deb', '.rpm', '.pkg', '.dmg', '.apk', '.appx', '.app'];
  if (installerExts.includes(ext)) return 'Instaladores';
  
  // Fontes
  const fontExts = ['.ttf', '.otf', '.woff', '.woff2', '.eot'];
  if (fontExts.includes(ext)) return 'Fontes';
  
  // Imagens de disco e ROMs
  const diskImageExts = ['.iso', '.img', '.vhd', '.vmdk', '.rom', '.bin', '.nes', '.sfc', '.n64', '.gb', '.gba'];
  if (diskImageExts.includes(ext)) return 'Imagens de Disco';
  
  // Bancos de dados
  const databaseExts = ['.db', '.sqlite', '.sqlite3', '.mdb', '.accdb', '.sql', '.bak'];
  if (databaseExts.includes(ext)) return 'Bancos de Dados';
  
  // Arquivos de design
  const designExts = ['.psd', '.ai', '.xd', '.sketch', '.fig', '.xcf', '.cdr', '.indd'];
  if (designExts.includes(ext)) return 'Arquivos de Design';
  
  // Modelos 3D e CAD
  const modelExts = ['.obj', '.fbx', '.stl', '.blend', '.3ds', '.dae', '.dwg', '.dxf'];
  if (modelExts.includes(ext)) return 'Modelos 3D';
  
  // Arquivos temporários e de backup
  const tempExts = ['.tmp', '.temp', '.bak', '.old', '.swp', '.~', '.log'];
  if (tempExts.includes(ext) || fileName.startsWith('~$') || fileName.startsWith('.')) 
    return 'Arquivos Temporários';
  
  // Verificar por extensões específicas que não foram capturadas pelo MIME
  switch (ext) {
    case '.torrent':
      return 'Torrents';
    case '.ics':
      return 'Calendários';
    case '.vcf':
      return 'Contatos';
    case '.gpx':
    case '.kml':
      return 'Dados Geográficos';
    case '.srt':
    case '.sub':
    case '.vtt':
      return 'Legendas';
  }
  
  // Verificar por padrões no nome do arquivo
  const fileName = path.basename(filePath).toLowerCase();
  
  if (fileName.includes('readme') || fileName.includes('leiame')) 
    return 'Documentação';
  
  if (fileName.includes('license') || fileName.includes('licence') || fileName.includes('licença')) 
    return 'Licenças';
  
  if (fileName.includes('backup') || fileName.includes('cópia')) 
    return 'Backups';
  
  // Categoria padrão para outros tipos
  return 'Outros';
}

/**
 * Analisa um lote de arquivos e determina os contextos apropriados usando Ollama
 * @param {Array<string>} fileNames - Lista de nomes de arquivos
 * @returns {Promise<Object>} - Mapeamento de nomes de arquivos para contextos
 */
async function batchAnalyzeContexts(fileNames) {
  try {
    console.log(`🤖 Analisando ${fileNames.length} arquivos com IA...`);
    
    // Limpa os nomes dos arquivos para análise
    const cleanNames = fileNames.map(fileName => {
      return fileName.replace(/\.[^/.]+$/, "")  // remove extensão
                    .replace(/[_\-]/g, " ")     // substitui underscores e hífens por espaços
                    .replace(/\s+/g, " ")       // normaliza espaços
                    .trim();
    });
    
    // Prompt elaborado para o modelo Ollama com instruções mais detalhadas
    const prompt = `
# Tarefa de Categorização Contextual de Arquivos

Você é um especialista em organização de informação e taxonomia. Sua tarefa é analisar nomes de arquivos e agrupá-los em categorias contextuais significativas.

## Lista de Arquivos para Análise:
${cleanNames.map((name, index) => `${index + 1}. "${name}"`).join('\n')}

## Instruções Detalhadas:

1. **Análise Semântica**: Analise o significado e propósito provável de cada arquivo com base em seu nome.

2. **Categorização Contextual**: Agrupe os arquivos em categorias que reflitam seu contexto de uso ou conteúdo.
   - Exemplos de boas categorias: "Projetos Acadêmicos", "Viagens Europa", "Relatórios Financeiros", "Fotos Família"
   - Exemplos de categorias ruins: "Documentos", "Arquivos", "Itens", "Diversos"

3. **Nível de Especificidade**: 
   - Seja específico o suficiente para ser útil (evite categorias muito genéricas)
   - Não seja excessivamente específico a ponto de cada arquivo ter sua própria categoria
   - Ideal: 5-10 arquivos por categoria, quando possível

4. **Consistência**: Use um estilo consistente para todas as categorias:
   - Use substantivos no plural (ex: "Relatórios" em vez de "Relatório")
   - Comece com letra maiúscula
   - Use termos em português
   - Mantenha um nível similar de especificidade entre categorias

5. **Interpretação Inteligente**:
   - Para nomes abreviados, tente inferir o significado completo
   - Para nomes com códigos ou números, identifique padrões e agrupe adequadamente
   - Para nomes muito curtos ou ambíguos, use outras pistas como prefixos ou sufixos comuns

6. **Categorias Proibidas**: Não use categorias genéricas como "Geral", "Diversos", "Outros", "Miscelânea" ou similares.

7. **Tratamento de Casos Especiais**:
   - Arquivos com datas: agrupe por evento ou propósito, não apenas pela data
   - Arquivos com nomes de pessoas: agrupe por tipo de relação ou contexto
   - Arquivos com números sequenciais: agrupe pelo propósito da sequência

## Exemplos de Categorização Eficaz:

- "relatorio_vendas_jan.pdf", "vendas_q1.xlsx", "metas_vendas_2023.docx" → "Relatórios de Vendas"
- "IMG_0123_paris.jpg", "eiffel_tower.jpg", "louvre_museum.jpg" → "Viagem Paris"
- "aula1_fisica.pdf", "exercicios_mecanica.docx", "notas_fisica_quantica.txt" → "Estudos de Física"

## Formato da Resposta:

Responda APENAS com um objeto JSON onde as chaves são os números dos arquivos e os valores são as categorias atribuídas:

{
  "1": "Relatórios Financeiros",
  "2": "Projetos de Marketing",
  "3": "Relatórios Financeiros",
  "4": "Fotos Família",
  ...
}

Certifique-se de que TODOS os arquivos recebam uma categoria significativa e contextual.
`;

    console.log('🔄 Consultando modelo de IA...');
    
    // Chamada para a API do Ollama
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepseek-r1:14b',
      prompt: prompt,
      stream: false
    });
    
    // Processa a resposta
    const responseText = response.data.response.trim();
    console.log('✅ Resposta recebida do modelo de IA');
    console.log(chalk.gray('-----------------------------------'));
    console.log(chalk.yellow('Resposta bruta da IA:'));
    console.log(chalk.white(responseText));
    console.log(chalk.gray('-----------------------------------'));
    
    // Extrai o JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Não foi possível extrair JSON da resposta do Ollama');
      return createAlternativeContextMap(fileNames);
    }
    
    try {
      const contextMap = JSON.parse(jsonMatch[0]);
      
      // Converte o mapa de índices para mapa de nomes de arquivos
      const result = {};
      for (let i = 0; i < fileNames.length; i++) {
        const index = (i + 1).toString();
        if (contextMap[index]) {
          result[fileNames[i]] = contextMap[index];
        } else {
          // Criar uma categoria mais inteligente baseada no nome do arquivo
          result[fileNames[i]] = createSmartCategory(fileNames[i]);
        }
      }
      
      console.log('📊 Categorias identificadas:');
      const categories = [...new Set(Object.values(result))];
      categories.forEach(category => {
        const count = Object.values(result).filter(c => c === category).length;
        console.log(`   🏷️  ${category}: ${count} arquivo(s)`);
      });
      
      return result;
    } catch (jsonError) {
      console.error(`❌ Erro ao analisar JSON da resposta do Ollama: ${jsonError.message}`);
      return createAlternativeContextMap(fileNames);
    }
  } catch (error) {
    console.error(`❌ Erro ao analisar contextos em lote: ${error.message}`);
    return createAlternativeContextMap(fileNames);
  }
}

/**
 * Cria uma categoria inteligente baseada no nome do arquivo
 * @param {string} fileName - Nome do arquivo
 * @returns {string} - Categoria gerada
 */
function createSmartCategory(fileName) {
  // Remover extensão e limpar o nome
  const cleanName = fileName.replace(/\.[^/.]+$/, "").trim();
  
  // Verificar padrões comuns no nome do arquivo
  
  // Verificar se contém datas no formato YYYY-MM-DD ou YYYYMMDD
  if (/\d{4}[-_]?\d{2}[-_]?\d{2}/.test(cleanName)) {
    return "Arquivos Datados";
  }
  
  // Verificar se é um recibo, fatura ou nota fiscal
  if (/recib|fatur|not[a]?.?fisc|nf[-_]?e|invoice|receipt/i.test(cleanName)) {
    return "Documentos Financeiros";
  }
  
  // Verificar se é um relatório
  if (/relat|report/i.test(cleanName)) {
    return "Relatórios";
  }
  
  // Verificar se é uma imagem ou foto
  if (/foto|image|img|pic|photo/i.test(cleanName)) {
    return "Fotografias";
  }
  
  // Verificar se é um documento de projeto
  if (/projet|project/i.test(cleanName)) {
    return "Documentos de Projetos";
  }
  
  // Verificar se é um currículo
  if (/curricul|cv|resume/i.test(cleanName)) {
    return "Currículos";
  }
  
  // Verificar se é um contrato
  if (/contrat|agreement|terms/i.test(cleanName)) {
    return "Contratos";
  }
  
  // Verificar se é um backup
  if (/backup|copia|copy/i.test(cleanName)) {
    return "Arquivos de Backup";
  }
  
  // Se o nome for muito curto (menos de 3 caracteres)
  if (cleanName.length < 3) {
    return "Arquivos Curtos";
  }
  
  // Se contém apenas números
  if (/^\d+$/.test(cleanName)) {
    return "Arquivos Numéricos";
  }
  
  // Caso padrão: usar a primeira palavra com inicial maiúscula e no plural
  const firstWord = cleanName.split(/[\s_-]/)[0];
  if (firstWord) {
    const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    // Adicionar 's' se não terminar com 's'
    return capitalized.endsWith('s') ? capitalized : `${capitalized}s`;
  }
  
  return "Arquivos Diversos";
}

/**
 * Cria um mapa de contextos alternativo para todos os arquivos
 * @param {Array<string>} fileNames - Lista de nomes de arquivos
 * @returns {Object} - Mapeamento de nomes de arquivos para contextos baseados no nome
 */
function createAlternativeContextMap(fileNames) {
  console.log('⚠️ Usando categorização alternativa baseada nos nomes dos arquivos');
  const result = {};
  
  for (const fileName of fileNames) {
    result[fileName] = createSmartCategory(fileName);
  }
  
  return result;
}

module.exports = {
  validateDirectory,
  getFileDate,
  formatDate,
  getFileCategory,
  batchAnalyzeContexts
}; 