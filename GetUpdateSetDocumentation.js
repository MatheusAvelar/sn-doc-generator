var GetUpdateSetDocumentation = Class.create();
GetUpdateSetDocumentation.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    getDocumentation: function() {
        var updateSetName = this.getParameter('sysparm_update_set');
        var audience = this.getParameter('sysparm_audience') || 'po';
        var userName = gs.getUserDisplayName();
        var gdt = new GlideDateTime();
        var today = gdt.getLocalDate().getByFormat('dd/MM/yyyy');

        // ===== Página Inicial =====
        var homeHtml = "";
        homeHtml += "<div style='text-align:center;margin-bottom:25px;padding:25px;background:#f1f8e9;border:1px solid #c5e1a5;border-radius:8px;'>";
        homeHtml += "  <img src='https://dev278204.service-now.com/6be4c85cc330b2107859b11ed4013140.iix' alt='Logo' style='width:300px;height:auto;margin-bottom:10px;' />";

        // Título dinâmico baseado no input de Cenário
        homeHtml += "  <h1 id='tituloPrincipal' style='margin:0;font-size:24px;'>Documentação - ServiceNow</h1>";
        homeHtml += "  <p style='font-size:14px;opacity:0.9;margin-top:6px;'>Gerador automático de evidências de testes e artefatos</p>";
        homeHtml += "</div>";

        if (!updateSetName)
            return homeHtml + "<p style='color:red;text-align:center;'>Nenhum Update Set informado.</p>";

        // ===== Cabeçalho =====
        var headerHtml = "<div style='background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:15px 20px;margin-bottom:20px;'>";
        headerHtml += "<div style='display:flex;justify-content:space-between;flex-wrap:wrap;align-items:center;'>";
        headerHtml += "<h3 style='margin:0;color:#333;'>🧾 Evidência de Testes</h3>";
        headerHtml += "<span style='color:#777;font-size:13px;'>Gerado em <b>" + today + "</b></span></div>";
        headerHtml += "<hr style='margin:10px 0;border:none;border-top:1px solid #eee;' />";

        // Inputs e placeholders
        headerHtml += "<table style='width:100%;border-collapse:collapse;font-size:14px;'>";
        headerHtml += "<tr><td style='padding:4px;'><b>Projeto:</b> <input type='text' placeholder='Ex: Portal de Chamados' style='width:90%;border:none;border-bottom:1px solid #ccc;padding:2px;' /></td>";
        headerHtml += "<td style='padding:4px;'><b>Data:</b> " + today + "</td></tr>";
        headerHtml += "<tr><td style='padding:4px;'><b>Executado Por:</b> " + userName + "</td>";
        headerHtml += "<td style='padding:4px;'><b>Squad:</b> <input type='text' placeholder='Nome da Squad' style='width:90%;border:none;border-bottom:1px solid #ccc;padding:2px;' /></td></tr>";
        headerHtml += "<tr><td style='padding:4px;'><b>Ambiente de Testes:</b> <input type='text' placeholder='Ex: DEV / TEST' style='width:90%;border:none;border-bottom:1px solid #ccc;padding:2px;' /></td>";
        headerHtml += "<td style='padding:4px;'><b>Status:</b> <span style='color:#4CAF50;font-weight:bold;'>Pronto</span></td></tr>";

        // Input de Cenário
        headerHtml += "<tr><td style='padding:4px;'><b>Cenário:</b> <input id='inputCenario' type='text' placeholder='Descreva o cenário testado' style='width:90%;border:none;border-bottom:1px solid #ccc;padding:2px;' oninput=\"(function(el){var t=document.getElementById('tituloPrincipal');var v=el.value.trim(); t.textContent = v ? 'Documentação - ' + v : 'Documentação - ServiceNow';})(this)\" onblur=\"(function(el){var t=document.getElementById('tituloPrincipal');var v=el.value.trim(); t.textContent = v ? 'Documentação - ' + v : 'Documentação - ServiceNow';})(this)\" /></td>";
        headerHtml += "<td style='padding:4px;'><b>Sistema:</b> ServiceNow</td></tr>";
        headerHtml += "<tr><td style='padding:4px;'><b>Story:</b> <input type='text' placeholder='Número da story (ex: Story-1234)' style='width:90%;border:none;border-bottom:1px solid #ccc;padding:2px;' /></td>";
        headerHtml += "<td style='padding:4px;'><b>Update Set:</b> " + updateSetName + "</td></tr>";
        headerHtml += "</table>";

        headerHtml += "<div style='margin-top:10px;'><b>Observações:</b>";
        headerHtml += "<textarea placeholder='Adicione observações relevantes...' style='width:100%;margin-top:5px;height:50px;border:1px solid #ccc;border-radius:6px;padding:6px;font-size:13px;resize:none;'></textarea></div></div>";

        // ===== Agrupa itens por tipo =====
        var allowedTypesForPO = ["Script Include", "Business Rule", "UI Page", "Table", "Field Label"];
        var updatesByType = {};
        var gr = new GlideRecord('sys_update_xml');
        gr.addQuery('update_set.name', updateSetName);
        gr.orderBy('type');
        gr.query();
        while (gr.next()) {
            var type = gr.type.toString();
            if (audience == "po" && allowedTypesForPO.indexOf(type) == -1) continue;
            if (!updatesByType[type]) updatesByType[type] = [];
            updatesByType[type].push(gr.getUniqueValue());
        }

        // ===== Sumário e evidências =====
        var summaryHtml = "<div style='background:#f1f8e9;border:1px solid #c5e1a5;border-radius:8px;padding:15px 20px;margin-bottom:25px;'>";
        summaryHtml += "<h3 style='margin-top:0;color:#33691e;'>📚 Sumário dos Artefatos</h3><ul style='list-style:none;padding-left:10px;margin:0;'>";
        for (var type in updatesByType) {
            var displayType = (audience == "po") ? this.getTranslatedTypeName(type) : type;
            var anchor = type.toLowerCase().replace(/\s+/g, "_");
            summaryHtml += "<li style='margin:4px 0;'><a href='#" + anchor + "' style='color:#00796b;text-decoration:none;font-weight:bold;'>🔹 " + displayType + "</a></li>";
        }
        summaryHtml += "</ul></div>";

        var evidenciasHtml = "<div id='blocoEvidencias' style='background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:15px 20px;margin-bottom:25px;'>";
        evidenciasHtml += "<style>#blocoEvidencias img { max-width:100%; height:auto; display:block; margin:auto; margin-bottom:10px; }</style>";
        evidenciasHtml += "<h3 style='margin-top:0;color:#ff6f00;'>🖼️ Evidências (Imagens)</h3>";
        evidenciasHtml += "<p style='font-size:13px;color:#555;margin-bottom:10px;'>Aqui você poderá adicionar imagens ou evidências relacionadas ao Update Set.</p>";
        evidenciasHtml += "</div>";

        // ===== Bloco detalhado (sem alteração) =====
        var blocoHtml = "";
        for (var type in updatesByType) {
            var icon = this.getIconByType(type);
            var displayType = (audience == "po") ? this.getTranslatedTypeName(type) : type;
            var anchor = type.toLowerCase().replace(/\s+/g, "_");

            blocoHtml += "<div id='" + anchor + "' style='background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin-bottom:20px;'>";
            blocoHtml += "<h3 style='margin:0 0 8px 0;color:#333;'>" + icon + " " + displayType + "</h3><ul style='list-style:none;padding-left:0;margin:0;'>";

            for (var i = 0; i < updatesByType[type].length; i++) {
                var grItem = new GlideRecord('sys_update_xml');
                if (grItem.get(updatesByType[type][i])) {
                    var friendlyName = this.getFriendlyName(type, grItem);
                    var description = this.getDescriptionByType(type, grItem) || (type === "Field Label" ? "Campo do formulário" : "Sem comentário");
                    var action = grItem.action.toString().toUpperCase();
                    var link = this.getRecordLink(grItem);

                    var actionLabel, actionColor;
                    switch (action) {
                        case 'DELETE':
                            actionLabel = 'Exclusão';
                            actionColor = '#F44336';
                            break;
                        case 'INSERT_OR_UPDATE':
                            actionLabel = 'Criação/Atualização';
                            actionColor = '#FF9800';
                            break;
                        default:
                            actionLabel = 'Outro';
                            actionColor = '#9E9E9E';
                    }

                    blocoHtml += "<li style='padding:8px 10px;margin-bottom:8px;border-radius:6px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.05);transition:0.2s;'>";
                    blocoHtml += "<div style='display:flex;justify-content:space-between;align-items:center;'><b style='color:#333;'>" + friendlyName + "</b>";
                    blocoHtml += "<span style='background:" + actionColor + ";color:white;padding:2px 8px;border-radius:12px;font-size:11px;'>" + actionLabel + "</span></div>";
                    blocoHtml += "<div style='color:#555;font-size:12px;margin-top:4px;'>" + description + "</div>";
                    blocoHtml += "<div style='margin-top:6px;'><a href='" + link + "' target='_blank' style='color:#2196F3;font-size:12px;text-decoration:none;'>🔗 Abrir artefato no ServiceNow</a></div>";
                    blocoHtml += "</li>";
                }
            }

            blocoHtml += "</ul><div style='text-align:right;margin-top:8px;'><a href='#top' style='font-size:12px;color:#00796b;text-decoration:none;'>⬆️ Voltar ao topo</a></div></div>";
        }

        // ===== Script para atualizar título dinamicamente =====
        var scriptHtml = "<script>document.addEventListener('DOMContentLoaded', function(){";
        scriptHtml += "var titulo=document.getElementById('tituloPrincipal');";
        scriptHtml += "var inputCenario=document.getElementById('inputCenario');";
        scriptHtml += "if(inputCenario && titulo){";
        scriptHtml += "inputCenario.addEventListener('input',function(){";
        scriptHtml += "var val=inputCenario.value.trim();";
        scriptHtml += "titulo.textContent = val ? 'Documentação - ' + val : '';";
        scriptHtml += "});}});</script>";

        // ===== Retorno Final =====
        return "<div id='top'>" + homeHtml + headerHtml + summaryHtml + evidenciasHtml + blocoHtml + scriptHtml + "</div>";
    },


    getDescriptionByType: function(type, grItem) {
        var description = "";
        var name = grItem.getValue('name');
        var sysIdMatch = name.match(/sys_[a-z_]+_([0-9a-f]{32})/);
        var sysId = sysIdMatch ? sysIdMatch[1] : null;

        switch (type) {
            case 'Script Include':
                if (sysId) {
                    var siGR = new GlideRecord('sys_script_include');
                    if (siGR.get(sysId)) description = siGR.getValue('description');
                }
                break;
            case 'Business Rule':
                if (sysId) {
                    var brGR = new GlideRecord('sys_script');
                    if (brGR.get(sysId)) description = brGR.getValue('description');
                }
                break;
            case 'UI Page':
                if (sysId) {
                    var uiGR = new GlideRecord('sys_ui_page');
                    if (uiGR.get(sysId)) description = uiGR.getValue('description');
                }
                break;
            case 'Table':
                if (sysId) {
                    var tblGR = new GlideRecord('sys_db_object');
                    if (tblGR.get(sysId)) description = tblGR.getValue('description');
                }
                break;
            case 'Field Label':
                description = "Campo do formulário";
                break;
            default:
                description = "";
        }
        return description;
    },

    getFriendlyName: function(type, gr) {
        var name = gr.name.toString();
        var sysIdMatch = name.match(/sys_[a-z_]+_([0-9a-f]{32})/);
        var sysId = sysIdMatch ? sysIdMatch[1] : null;

        switch (type) {
            case 'Script Include':
                if (sysId) {
                    var siGR = new GlideRecord('sys_script_include');
                    if (siGR.get(sysId)) return siGR.getDisplayValue() + " (" + siGR.name + ")";
                }
                return name;
            case 'Business Rule':
                if (sysId) {
                    var brGR = new GlideRecord('sys_script');
                    if (brGR.get(sysId)) return brGR.getDisplayValue() + " (" + brGR.name + ")";
                }
                return name;
            case 'Table':
                if (sysId) {
                    var tblGR = new GlideRecord('sys_db_object');
                    if (tblGR.get(sysId)) return tblGR.getDisplayValue() + " (" + tblGR.name + ")";
                }
                return name;
            case 'UI Page':
                if (sysId) {
                    var uiGR = new GlideRecord('sys_ui_page');
                    if (uiGR.get(sysId)) return uiGR.getDisplayValue() + " (" + uiGR.name + ")";
                }
                var uGR = new GlideRecord('sys_ui_page');
                uGR.addQuery('name', name);
                uGR.query();
                if (uGR.next()) return uGR.title + " (" + name + ")";
                return name;
            case 'Field Label':
                return this.getFriendlyFieldLabel(name);
            default:
                return name;
        }
    },

    getFriendlyFieldLabel: function(updateXmlName) {
        var nameWithoutPrefix = updateXmlName.replace(/^sys_documentation_/, '');
        var lastUIndex = nameWithoutPrefix.lastIndexOf('_u_');
        var columnName = lastUIndex !== -1 ? nameWithoutPrefix.substring(lastUIndex + 1) : nameWithoutPrefix;
        columnName = columnName.replace(/_en$/, '');
        var fGR = new GlideRecord('sys_dictionary');
        fGR.addQuery('element', columnName);
        fGR.query();
        if (fGR.next()) return fGR.column_label + " (" + columnName + ")";
        return columnName;
    },

    getIconByType: function(type) {
        switch (type) {
            // ==== Back-end ====
            case 'Script Include':
                return '🧠';
            case 'Business Rule':
                return '⚙️';
            case 'Scheduled Script Execution': // Scheduled Job
            case 'Scheduled Script':
                return '⏰';
            case 'Fix Script':
                return '🩹';
            case 'Flow':
                return '🌊';
            case 'Subflow':
                return '🌊';
            case 'Action':
                return '🎯';
            case 'Flow Action':
                return '🔁';
            case 'Script Action':
                return '📜';
            case 'Scripted REST Resource':
                return '🔌';
            case 'Scripted REST API':
                return '🌐';
            case 'REST Message':
                return '📡';
            case 'SOAP Message':
                return '🧴';
            case 'Transform Map':
                return '🔄';
            case 'Import Set Table':
                return '📥';
            case 'Import Set Transform Map':
                return '♻️';
            case 'Data Source':
                return '🗂️';
            case 'Record Producer':
                return '🧾';
            case 'Catalog Script':
                return '💬';
            case 'Script Include Test':
                return '🧪';
            case 'Access Control':
                return '🔒';
            case 'ACL':
                return '🔐';
            case 'Event Registry':
                return '📣';
            case 'Notification Email Script':
                return '📧';
            case 'Notification':
                return '📨';
            case 'UI Script':
                return '🪶';
            case 'UI Macro':
                return '🧩';
            case 'UI Formatter':
                return '🪄';
            case 'Processor':
                return '⚙️';

                // ==== Front-end / UI ====
            case 'UI Page':
                return '🌍';
            case 'UI Action':
                return '🎬';
            case 'UI Policy':
                return '🧭';
            case 'Client Script':
                return '💻';
            case 'Form Design':
                return '🧱';
            case 'Form Layout':
                return '🧩';
            case 'Field Label':
                return '🏷️';
            case 'Catalog Client Script':
                return '🖱️';
            case 'Catalog UI Policy':
                return '🎨';
            case 'Widget':
                return '🧱';
            case 'Service Portal':
                return '🚪';
            case 'Theme':
                return '🎨';
            case 'Menu':
                return '📜';
            case 'Module':
                return '📁';
            case 'Application Menu':
                return '🧭';
            case 'Navigation Menu':
                return '🗺️';
            case 'Page Route':
                return '🛤️';
            case 'Dashboard':
                return '📊';
            case 'Report':
                return '📈';
            case 'Visualization':
                return '📉';
            case 'UI Builder Page':
                return '🏗️';

                // ==== Dados / Estrutura ====
            case 'Table':
                return '🗃️';
            case 'Dictionary Entry':
                return '📚';
            case 'Dictionary Override':
                return '📘';
            case 'Field':
                return '🧾';
            case 'Choice List':
                return '🔢';
            case 'Reference Qualifier':
                return '🔗';
            case 'List Layout':
                return '🧮';
            case 'Form Section':
                return '📋';
            case 'View':
                return '👁️';
            case 'Relationship':
                return '🪢';
            case 'CI Relationship':
                return '🔩';
            case 'CI Class':
                return '🏭';

                // ==== Catálogo / Portal ====
            case 'Catalog Item':
                return '🛒';
            case 'Record Producer':
                return '🧾';
            case 'Order Guide':
                return '📦';
            case 'Flow Designer Action':
                return '⚡';
            case 'Flow Designer Subflow':
                return '🔄';

                // ==== Workflows e Automação ====
            case 'Workflow':
                return '🔁';
            case 'Workflow Activity':
                return '⚙️';
            case 'Approval Definition':
                return '✅';
            case 'Approval Rule':
                return '☑️';
            case 'Assignment Rule':
                return '📌';
            case 'Notification Trigger':
                return '🔔';

                // ==== Segurança e Configuração ====
            case 'Role':
                return '🧩';
            case 'Group':
                return '👥';
            case 'User':
                return '👤';
            case 'Property':
                return '⚙️';
            case 'System Property':
                return '🧭';
            case 'UI Property':
                return '🪟';
            case 'Access Role':
                return '🔐';
            case 'Security Rule':
                return '🛡️';
            case 'Domain':
                return '🌐';
            case 'Domain Separation':
                return '🌍';

                // ==== Integrações ====
            case 'Connection & Credential Alias':
                return '🔑';
            case 'MID Server Script Include':
                return '🛰️';
            case 'IntegrationHub':
                return '🔗';
            case 'Spoke':
                return '🛠️';
            case 'REST API Explorer':
                return '🚀';
            case 'Outbound REST Message':
                return '📤';
            case 'Inbound REST Message':
                return '📥';

                // ==== Outros ====
            case 'Update Set':
                return '📦';
            case 'Application File':
                return '🗂️';
            case 'System Definition':
                return '⚙️';
            case 'Global UI Script':
                return '🌐';
            case 'Style Sheet':
                return '🎨';
            case 'Content Block':
                return '🧱';
            case 'Content Layout':
                return '🖼️';
            case 'Content Theme':
                return '🪶';
            case 'Content Type':
                return '📑';
            case 'Announcement':
                return '📢';
            case 'Knowledge Article':
                return '📘';
            case 'SLA Definition':
                return '⏱️';
            case 'SLA Workflow':
                return '📏';
            case 'Metric Definition':
                return '📊';
            case 'Report Source':
                return '📄';
            case 'Scripted REST API Resource':
                return '🔌';
            case 'Schedule':
                return '📆';
            case 'Email Layout':
                return '✉️';
            case 'Email Notification':
                return '📨';
            case 'Email Template':
                return '📧';

                // ==== Padrão ====
            default:
                return '📄';
        }
    },

    getTranslatedTypeName: function(type) {
        var map = {
            "Script Include": "Script de Servidor",
            "Business Rule": "Regra de Negócio",
            "UI Page": "Página de Interface",
            "UI Action": "Botão ou Ação de Interface",
            "UI Policy": "Política de Interface",
            "Client Script": "Script de Cliente",
            "Table": "Tabela de Dados",
            "Field Label": "Rótulo de Campo",
            "Flow": "Fluxo de Automação",
            "Subflow": "Subfluxo",
            "Widget": "Componente de Portal",
            "Catalog Item": "Item de Catálogo",
            "Record Producer": "Produtor de Registro",
            "Notification": "Notificação",
            "Report": "Relatório",
            "Dashboard": "Painel",
            "Role": "Função de Acesso",
            "Group": "Grupo de Usuários",
            "Property": "Propriedade do Sistema",
            "Scripted REST API": "API REST Personalizada",
            "Transform Map": "Mapa de Transformação",
            "Import Set Table": "Tabela de Importação",
            "Access Control": "Controle de Acesso",
            "Workflow": "Fluxo de Trabalho",
            "Application Menu": "Menu de Aplicação",
            "Module": "Módulo de Navegação",
            "UI Builder Page": "Página do UI Builder",
            "Style Sheet": "Folha de Estilo (CSS)",
            "Notification Email Script": "Script de E-mail",
            "Fix Script": "Script de Correção",
            "REST Message": "Mensagem REST",
            "Event Registry": "Registro de Evento",
            "Dictionary Entry": "Entrada de Dicionário",
            "Choice List": "Lista de Opções",
            "Form Design": "Design de Formulário",
            "Form Layout": "Layout de Formulário"
        };

        return map[type] || type;
    },

    getRecordLink: function(gr) {
        var instanceUrl = gs.getProperty('doc.uri');
        var link = "";
        var nameMatch = gr.name.match(/^(.*)_([0-9a-f]{32})$/i);
        if (nameMatch) link = instanceUrl + nameMatch[1] + ".do?sys_id=" + nameMatch[2];

        return link;
    },

});
