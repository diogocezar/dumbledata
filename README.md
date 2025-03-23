# 🧙‍♂️ DumbleData

DumbleData é uma aplicação CLI em Node.js que organiza arquivos em um diretório especificado pelo usuário, utilizando inteligência artificial para determinar o contexto dos arquivos.

## ✨ Funcionalidades

- 📁 Organiza arquivos por tipo (Imagens, Vídeos, Músicas, Documentos, etc.)
- 📅 Agrupa arquivos por ano
- 🧠 Usa IA para determinar o contexto dos arquivos
- 🏷️ Cria estrutura de pastas inteligente baseada em contextos
- 🔄 Renomeia arquivos seguindo o padrão YYYYMMDD-nome.ext
- 🔒 Preserva os arquivos originais (copia em vez de mover)

## 🚀 Instalação

### Pré-requisitos

- Node.js 14 ou superior
- [Ollama](https://ollama.ai/) instalado e rodando localmente
- Modelo `deepseek-r1:14b` instalado no Ollama

### Instalação do Ollama e do modelo

1. Instale o Ollama seguindo as instruções em [ollama.ai](https://ollama.ai/)
2. Abra um terminal e execute:
   ```
   ollama pull deepseek-r1:14b
   ```
3. Inicie o servidor Ollama:
   ```
   ollama serve
   ```
start
### Instalação do DumbleData

# Clone o repositório
git clone https://github.com/seu-usuario/dumbledata.git
cd dumbledata

# Instale as dependências
npm install

# Instale globalmente (opcional)
npm install -g .
```

## 🎮 Uso

### Verificar se o Ollama está rodando

Antes de usar o DumbleData, certifique-se de que o servidor Ollama está rodando:

```
curl http://localhost:11434/api/tags
```

Se você receber uma resposta JSON, o servidor está funcionando corretamente.

### Executar o DumbleData

```
# Se instalado globalmente
dumbledata [diretório]

# Ou usando npm
npm start -- [diretório]

# Ou diretamente
node index.js [diretório]
```

### Opções

- `[diretório]`: Caminho do diretório a ser organizado. Se não for fornecido, será solicitado.
- `-y, --yes`: Pula a confirmação antes de iniciar a organização.
- `-V, --version`: Exibe a versão da aplicação.
- `-h, --help`: Exibe a ajuda.

## 📂 Estrutura de Pastas Resultante

```
diretório/
├── organized/
│   ├── Imagens/
│   │   ├── 2023/
│   │   │   ├── Viagens/
│   │   │   │   └── 20230415-praia.jpg
│   │   │   └── Família/
│   │   │       └── 20230101-aniversario.png
│   │   └── 2024/
│   │       └── ...
│   ├── Vídeos/
│   │   └── ...
│   ├── Músicas/
│   │   └── ...
│   └── ...
└── ... (arquivos originais)
```

## 🧩 Como Funciona

1. **Análise de Arquivos**: O DumbleData analisa todos os arquivos no diretório especificado.
2. **Categorização por Tipo**: Cada arquivo é categorizado com base em seu tipo MIME ou extensão.
3. **Análise de Contexto com IA**: O modelo Ollama deepseek-r1:14b é usado para determinar o contexto de cada arquivo com base em seu nome.
4. **Organização**: Os arquivos são copiados para uma estrutura de pastas organizada por tipo, ano e contexto.
5. **Renomeação**: Os arquivos são renomeados seguindo o padrão YYYYMMDD-nome.ext.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma de execução
- **fs-extra**: Manipulação avançada de arquivos
- **commander**: Interface de linha de comando
- **inquirer**: Interação com o usuário
- **chalk**: Colorização do terminal
- **ora**: Spinners para o terminal
- **mime-types**: Detecção de tipos MIME
- **axios**: Requisições HTTP para a API do Ollama
- **Ollama**: Execução local de modelos de IA

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.