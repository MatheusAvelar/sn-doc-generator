# 📝 ServiceNow Update Set Documentation Generator

Uma ferramenta para gerar **documentação automatizada** de Update Sets no ServiceNow, incluindo evidências de testes, artefatos, descrições e previews de imagens. Ideal para desenvolvedores, POs e equipes de QA que desejam ter uma visão rápida e organizada dos itens implementados.

---

## 🚀 Funcionalidades Principais

### 🔹 Script Include: `GetUpdateSetDocumentation`
- Gera o HTML completo da documentação do Update Set.
- Filtra artefatos por tipo e público-alvo (`dev` ou `po`).
- Agrupa itens por tipo: Script Include, Business Rule, UI Page, Table, Field Label, entre outros.
- Exibe:
  - Nome amigável do artefato.
  - Descrição do artefato.
  - Status da ação (Exclusão, Criação/Atualização, Outro).
  - Link direto para o registro no ServiceNow.
  - Ícones intuitivos para cada tipo de artefato.
- Atualiza dinamicamente o título da documentação baseado no **Cenário de Teste**.
- Suporte à tradução de tipos para linguagem amigável ao público PO.

---

### 🔹 UI Page
- Inputs:
  - Nome do Update Set
  - Público-alvo (`Dev` ou `PO`)
- Botões:
  - ⚙️ **Gerar Documentação** – solicita o Script Include e gera a documentação.
  - 💾 **Exportar PDF** – abre uma nova janela para impressão ou salvamento.
  - 📎 **Anexar Imagem** – upload de imagens relacionadas às evidências.
- Pré-visualização de imagens e inputs de descrição.
- Inputs e placeholders para informações adicionais: projeto, squad, cenário, story, ambiente de testes e observações.
- Estilização moderna e responsiva.

---

### 📸 Evidências e Interatividade
- Upload de imagens: JPG, PNG, GIF.
- Inputs de descrição para cada imagem.
- Mensagens de alerta para validação do tipo de arquivo.
- Botão de anexar imagens só aparece após gerar a documentação.

---

### 🗂️ Tipos de Artefatos Suportados
- **Back-end / Server-side:** 🧠 Script Include, ⚙️ Business Rule, 🩹 Fix Script, ⏰ Scheduled Job, 🌊 Flow, 🔌 REST API, 🔄 Transform Map, 🔒 ACL, etc.
- **Front-end / UI:** 🌍 UI Page, 🎬 UI Action, 💻 Client Script, 🧩 Form Layout, 🏷️ Field Label, 🧱 Widget, 🚪 Service Portal, 📊 Dashboard, etc.
- **Integrações:** 📡 REST Message, 🧴 SOAP Message, 🔗 IntegrationHub, 🛠️ Spokes, etc.
- **Outros:** 📦 Update Set, 🗂️ Application File, 🧭 System Property, 🎨 Style Sheet, ✉️ Email Template, 📘 Knowledge Article, ⏱️ SLA, 📊 Metric, 📈 Report, etc.

---

### ⚙️ Principais Métodos do Script Include
| Método | Descrição |
|--------|-----------|
| `getDocumentation()` | Gera o HTML completo da documentação. |
| `getDescriptionByType(type, grItem)` | Retorna a descrição do artefato. |
| `getFriendlyName(type, gr)` | Retorna um nome amigável do artefato. |
| `getIconByType(type)` | Retorna um emoji representando o tipo de artefato. |
| `getTranslatedTypeName(type)` | Traduz o tipo de artefato para POs. |
| `getRecordLink(gr)` | Retorna o link direto do registro no ServiceNow. |

---

### 🛠️ Como Usar
1. Abra a **UI Page** no ServiceNow.
2. Informe o nome do **Update Set**.
3. Selecione o público (PO ou Dev).
4. Clique em ⚙️ **Gerar Documentação**.
5. Adicione imagens e descrições, se necessário.
6. Clique em 💾 **Exportar PDF** para imprimir ou salvar.

---

### 📌 Requisitos
- Acesso à tabela `sys_update_xml` e tabelas de configuração de artefatos (`sys_script_include`, `sys_script`, `sys_ui_page`, `sys_db_object`, `sys_dictionary`, etc.).
- Permissões de leitura nos registros do Update Set.
- Navegador moderno para visualizar a UI Page.

---

### 🎯 Benefícios
- Geração rápida e organizada de documentação de Update Sets.
- Facilita comunicação entre desenvolvimento, QA e POs.
- Suporte a evidências visuais na documentação.
- Reduz esforço manual de registrar alterações e artefatos implementados.

---

### 📖 License
Este projeto é **open-source** e pode ser usado como base para personalizações em outros ambientes ServiceNow.

