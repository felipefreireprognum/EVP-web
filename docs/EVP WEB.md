**Análise da Criação do EVP Web**

**Contexto**

Criar o EVP na versão web e com tecnologias mais atuais utilizando o banco padrão do EVP, criaremos um front end com 2 vertentes: 

* Uma lista de para as tarefas do usuário na mostraria as seguintes colunas: Tarefas – Descrição Tarefas – Status – Horas – Início – Término – Solicitação – Responsável – Cliente – Terminado em – Sistema – pontos previstos – Setor – Expectativa Fornecedor  
    
* E outra com base em gráficos Kanban na qual as colunas seria por status: Disponível – Em andamento – Em pausa – Vencida – Concluída(Só deverá aparecer com o filtro de concluexata a**Tipo da Tarefa**: Classificação da natureza do trabalho (ex: Produto, suporte, QA, etc).  
* **Tipo de Finalização**: Define c  
* **Tarefas com/sem erro**: Filtro binário para identificar demandas que apresentaram falhas técnicas.ído marcado) e as tarefas ficariam em Cards


Deverá ter um botão na qual irá abrir um modal com os seguintes filtros:  
Com base na interface de "Define Consulta de Tarefas", aqui está a lista dos filtros para a especificação da versão web:

* **Setor**: Filtra as tarefas de acordo com o departamento ou unidade organizacional.  
* **Exibe Setores Inativos**: Checkbox para incluir setores que não estão mais operantes na busca.  
*  externo vincuomo a tarefa foi encerrada ou qual o desfecho esperado.lado à tarefa.  
* **Número da Solicitação**: Campo de texto para busca   
* **Tipo de Erro**: Categorização específica da falha ocorrida na tarefa.  
* **Sistema**: Seleciona o software ou módulo relacionado àquela demanda.  
* **Cliente**: Identifica a empresa ou solicitantetravés do ID numérico.  
* **Tipo de Solicitação**: Classifica a origem ou o formato do pedido inicial.  
* **Previsão de Término (De/Até)**: Filtro de intervalo de datas para o prazo final estimado.  
* **Data Início Tarefa (De/Até)**: Intervalo de datas em que a execução foi efetivamente iniciada.  
* **Data Fim Tarefa (De/Até)**: Intervalo de datas para quando o trabalho foi concluído.  
* **Status da Tarefa**: Seleção múltipla para estados atuais (Disponível, Em Andamento, Pausa, Correção, Concluída).   
* **Exibe tarefas excluídas**: Opção para visualizar registros que foram removidos logicamente.  
* **Origem das Tarefas**: Radio button para filtrar entre demandas Internas, Externas ou Todas.

## **a) Contexto**

O projeto consiste na migração e evolução do **EVP (Escritório Virtual Prognum)** da sua plataforma desktop legada para um ecossistema web de alta performance. O objetivo central é desacoplar a interface de usuário das limitações do software atual, utilizando tecnologias de front-end modernas enquanto se mantém a integridade operacional ao utilizar o **banco de dados padrão do EVP**.

### **1\. Visualização em Lista (Data Management)**

Focada em alta densidade de informação e auditoria, esta visão exibirá de forma estruturada as seguintes colunas de dados:

* **Identificação e Status:** Tarefas, Descrição, Status, Sistema, Setor e Responsável.  
* **Métricas e Prazos:** Horas, Início, Término, Terminado em, Pontos Previstos e Expectativa Fornecedor.  
* **Vínculos:** Solicitação (ID da SCAT) e Cliente.

### **2\. Visualização em Kanban (Gestão Ágil)**

Um quadro de fluxos dinâmico onde as tarefas são representadas por cards interativos, organizados pelas seguintes colunas de status:

* **Disponível:** Tarefas prontas para início.  
* **Em Andamento:** Demandas com cronômetro ativo/execução iniciada.  
* **Em Pausa:** Tarefas temporariamente interrompidas.  
* **Vencida:** Tarefas que ultrapassaram o SLA ou a previsão de término.  
* **Concluída:** Coluna com visibilidade condicionada ao acionamento do filtro específico de "Tarefas Concluídas".

### **3\. Motor de Busca e Filtragem Avançada**

Para suportar a complexidade da gestão de demandas, o sistema contará com um modal centralizador de filtros, permitindo uma segmentação precisa baseada em:

* **Parâmetros de Unidade:** Setor (incluindo opção para exibir setores inativos), Cliente e Sistema.  
* **Classificação Técnica:** Tipo da Tarefa (Produto, Suporte, QA, etc.), Tipo de Solicitação, Tipo de Finalização e Tipo de Erro.  
* **Filtros de Exceção:** Tarefas com/sem erro, exibição de tarefas excluídas e origem da demanda (Internas, Externas ou Todas).  
* **Controle Temporal:** Filtros de intervalo (De/Até) para Previsão de Término, Data de Início e Data de Fim.  
* **Busca Exata:** Localização direta através do Número da Solicitação (ID).

### **4\. Gestão de Fluxo SCAT e Tarefas**

O contexto desta análise abrange não apenas a listagem, mas a gestão profunda da **SCAT (Entidade Pai)** e suas respectivas **Tarefas (Entidades Filhas)**. Isso inclui a modernização de componentes críticos como o cálculo de Pontos de Função, a elaboração de Planos de Testes, a gestão de documentos e a análise técnica via editores de texto rico (Rich Text), eliminando as barreiras visuais do sistema antigo.

## **b) Requisitos Funcionais e Regras de Negócio**

### **1\. Gestão de Tempo (Timesheet)**

* **Precisão de Registro:** O sistema deve registrar entradas e saídas (Check-in/Check-out) com precisão de milissegundos, conforme o padrão do banco legado.  
* **Cálculo de Horas:** O total de "Horas Trabalhadas" deve ser a somatória de todos os períodos registrados no histórico da tarefa.  
* **Persistência de Estado:** Ao alternar uma tarefa para o status "Em Pausa" ou "Em Correção", o cronômetro ativo deve ser interrompido e um registro de fechamento deve ser inserido automaticamente no histórico.

### **2\. Módulo de SCAT (Entidade Pai)**

A SCAT centraliza os requisitos e a métrica de valor do projeto.

* **Análise Técnica e Relato:** Campos de documentação que suportam grandes volumes de texto e formatação para especificações detalhadas.  
* **Cálculo de Pontos de Função (PF):**  
  * Entrada de dados baseada em tipos de função (ALI, AIE, SE, CE, EE).  
  * Atribuição de graus de complexidade (Baixa, Média, Alta) que resultam em pesos específicos.  
  * Cálculo do PF Bruto e aplicação do fator de ajuste para obtenção do PF Ajustado.  
* **Plano de Testes:** Estruturação de roteiros de validação vinculados à SCAT, definindo ambiente operacional, caminhos de acesso e critérios de aceitação.  
* **Gestão de Ativos:** Repositório de documentos (PDF, Imagens, Pastas) vinculado à solicitação, permitindo a rastreabilidade de evidências e anexos.

### **3\. Módulo de Tarefas (Entidade Filha)**

* **Vínculo Hierárquico:** Cada tarefa deve obrigatoriamente estar associada a uma SCAT de origem.  
* **Parâmetros de Execução:** Definição de Grau de Dificuldade, Previsão de Início e Término.  
* **Encerramento de Ciclo:** A conclusão de uma tarefa exige a classificação do "Tipo de Erro" (caso aplicável) e "Tipo de Finalização", garantindo dados para relatórios de qualidade futuros.

---

## **c) Lógica de Dados e Filtros de Consulta**

O motor de busca deve refletir a complexidade do banco padrão, permitindo cruzamentos de dados por:

* **Setores e Usuários:** Filtros por departamento (incluindo ativos/inativos) e atribuição de responsabilidade.  
* **Natureza da Demanda:** Segmentação por Tipo de Tarefa (Produto, Suporte, QA), Sistema e Cliente.  
* **Rastreabilidade:** Busca exata por Número da Solicitação ou filtragem por origem da tarefa (Internas vs. Externas).  
* **Auditoria de Exclusão:** Opção para visualizar registros marcados como removidos logicamente no banco de dados.

---

## **d) Integração e Performance**

* **Compatibilidade de Banco:** O Front-end deve consumir as APIs que acessam diretamente o esquema de tabelas do EVP atual, respeitando os tipos de dados e constraints existentes.  
* **Tratamento de Dados:** Conversão de formatos de data/hora do banco para exibição legível no navegador, mantendo a integridade para cálculos matemáticos de tempo.

