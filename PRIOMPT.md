Crie uma aplicação CLI em Node.js chamada DumbleData que organize arquivos em um diretório especificado pelo usuário. A aplicação deve seguir as seguintes regras:

1. **Entrada**:
   - O usuário deve passar o caminho do diretório a ser organizado como argumento ao executar o script.

1. **Processamento**:
   - Analise todos os arquivos no diretório especificado.
   - Crie uma pasta chamada `organized` na raiz do diretório especificado.
   - Dentro da pasta `organized`, crie subpastas para cada tipo de arquivo, como por exemplo:
     - `Imagens`
     - `Vídeos`
     - `Músicas`
     - `Documentos`
     - `Instaladores`
     - `PDFs`
     - `ROMs`
   - Você deve percorrer todos os possíveis arquivos, e definir quais são as possíveis pastas. Para isso, utilize algum tipo de modelo de IA se for necessário.

3. **Organização**:
   - Utilize metadados dos arquivos (como data de criação e tipo) para organizá-los.
   - Dentro de cada pasta de tipo, organize os arquivos por ano (ex: `Imagens/2023`, `Vídeos/2024`).
   - Agrupe arquivos com contextos semelhantes em subpastas (ex: `Imagens/2023/Aniversário`, `Vídeos/2024/Férias`).
   - Renomeie todos os arquivos para seguir o padrão: `YYYYMMDD-nome.ext`, onde:
     - `YYYYMMDD` é a data de criação do arquivo.
     - `nome` é o nome original do arquivo (sem a extensão).
     - `.ext` é a extensão do arquivo.

1. **Saída**:
   - Ao final da execução, todos os arquivos devem estar organizados conforme as regras acima.
   - A estrutura de pastas deve ser clara e fácil de navegar.
   - Não se deve apagar ou remover os arquivos originais.
   - Os arquivos não devem ser MOVIDOS, e sim COPIADOS.

1. **Requisitos técnicos**:
   - Utilize a biblioteca `fs` do Node.js para manipulação de arquivos.
   - Utilize a biblioteca `path` para lidar com caminhos de arquivos.
   - Utilize a biblioteca `exif-reader` ou similar para extrair metadados de imagens e vídeos.
   - Utilize a biblioteca `inquirer` para interagir com o usuário, caso necessário.
   - O CLI deve executar rapidamente, considere estratégias para deixar a execução e manipulação dos arquivos rápida.
   - O código deve ser modular e bem documentado.

1. **Considerações**:
- O código deve ser robusto e lidar com possíveis erros, como arquivos sem metadados ou permissões insuficientes.
- O código deve ser eficiente para lidar com grandes quantidades de arquivos.
- O código deve ser testado e funcionar em diferentes sistemas operacionais (Windows, macOS, Linux).
- Deve-se logar as ações a serem realizadas.

8. **Saída esperada**:
- Uma aplicação Node.js, funcional que possa ser executado via terminal.
- Instruções claras sobre como executar o script e exemplos de uso.