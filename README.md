# 🧙‍♂️ DumbleData

<div align="center">

Uma aplicação CLI em Node.js que organiza arquivos de forma inteligente usando IA.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

</div>

---

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Instalação](#-instalação)
- [🎮 Uso](#-uso)
- [📂 Estrutura](#-estrutura)
- [🧩 Como Funciona](#-como-funciona)
- [🛠️ Tecnologias](#️-tecnologias)
- [📝 Licença](#-licença)

## ✨ Funcionalidades

- 📁 **Organização Inteligente**: Categoriza arquivos por tipo (Imagens, Vídeos, Músicas, etc.)
- 📅 **Agrupamento Temporal**: Organiza arquivos por ano
- 🧠 **Análise com IA**: Utiliza IA para determinar o contexto dos arquivos
- 🏷️ **Estrutura Intuitiva**: Cria hierarquia de pastas baseada em contextos
- 🔄 **Padronização**: Renomeia arquivos para o formato `YYYYMMDD-nome.ext`
- 🔒 **Segurança**: Preserva os arquivos originais (copia em vez de mover)

## 🚀 Instalação

### Pré-requisitos

| Requisito | Versão |
|-----------|---------|
| Node.js | ≥ 14.0.0 |
| Ollama | Última versão |
| Modelo IA | deepseek-r1:14b |

### 1. Instalação do Ollama

1. Baixe e instale o Ollama do [site oficial](https://ollama.ai/)
2. Instale o modelo necessário:
   ```bash
   ollama pull deepseek-r1:14b
   ```
3. Inicie o servidor:
   ```bash
   ollama serve
   ```

### 2. Instalação do DumbleData

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dumbledata.git

# Entre no diretório
cd dumbledata

# Instale as dependências
npm install

# (Opcional) Instale globalmente
npm install -g .
```

## 🎮 Uso

### Verificação do Servidor

Antes de usar, verifique se o Ollama está rodando:

```bash
curl http://localhost:11434/api/tags
```

### Comandos Disponíveis

```bash
# Uso global
dumbledata [diretório]

# Uso com npm
npm start -- [diretório]

# Uso direto
node index.js [diretório]
```

### Opções

| Opção | Descrição |
|-------|-----------|
| `[diretório]` | Caminho do diretório a organizar |
| `-y, --yes` | Pula confirmações |
| `-V, --version` | Exibe a versão |
| `-h, --help` | Mostra ajuda |

## 📂 Estrutura

Após a execução, seus arquivos serão organizados assim:

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
│   └── ... (arquivos originais)
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