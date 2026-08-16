# Pendências antes da publicação externa

Este documento controla as autorizações, análises e aprovações que devem ser concluídas antes de distribuir o RadRef fora de ambientes privados de desenvolvimento ou teste. Isso inclui publicação no GitHub, distribuição web e disponibilização nas lojas Apple App Store e Google Play.

> **Bloqueio de lançamento:** não publicar uma versão externa enquanto houver um item aplicável marcado como `PENDENTE` ou `EM ANÁLISE`.

Este checklist não é um parecer jurídico ou regulatório. A decisão de que uma autorização não é necessária deve ser registrada por escrito por profissional habilitado e arquivada com as demais evidências do lançamento. Citar corretamente uma fonte é obrigatório, mas não substitui licença, autorização de marca, permissão para obra derivada ou regularização sanitária.

## Status

- `PENDENTE`: contato, análise ou documento ainda não iniciado ou concluído.
- `EM ANÁLISE`: solicitação enviada ou avaliação em andamento.
- `AUTORIZADO`: autorização recebida e compatível com o uso pretendido.
- `NÃO APLICÁVEL`: dispensado por decisão escrita, com fundamento e responsável identificados.
- `BLOQUEADO`: autorização negada ou termos incompatíveis; o conteúdo correspondente deve ser removido ou redesenhado antes da publicação.

## 1. Direitos sobre classificações e conteúdo clínico

### P-01 — ACR Lung-RADS® v2022

- **Status:** `PENDENTE`.
- **Titular/contato:** American College of Radiology (ACR), pelo formulário **Request Permission for Lung-RADS** disponível na [página oficial do Lung-RADS](https://www.acr.org/clinical-resources/clinical-tools-and-reference/reporting-and-data-systems/lung-rads).
- **Solicitar autorização para:** implementação interativa das categorias e recomendações; interface em português e inglês; adaptação/paráfrase; uso dos nomes `ACR` e `Lung-RADS®`; distribuição gratuita ou comercial em código aberto, web, iOS e Android; screenshots e descrição nas lojas.
- **Informar no pedido:** versão implementada, público profissional pretendido, ausência de PDF/tabelas/figuras originais, forma de atribuição, aviso de uso educacional e possibilidade de alterações futuras.
- **Evidência exigida:** licença, contrato ou mensagem escrita do ACR definindo escopo, versões, territórios, plataformas, prazo, atribuição e eventuais restrições.

### P-02 — ACR LI-RADS® CT/MRI v2018 e TRA v2024

- **Status:** `PENDENTE`.
- **Titular/contato:** American College of Radiology, pelo formulário **Request Permission for LI-RADS** e pelo contato `RADS@acr.org` indicados na [página oficial do LI-RADS](https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/LI-RADS).
- **Solicitar autorização para:** algoritmos interativos de diagnóstico e resposta ao tratamento; categorias e terminologia LR; tradução PT/EN; adaptação/paráfrase; uso dos nomes `ACR` e `LI-RADS®`; distribuição nas mesmas modalidades previstas para o RadRef.
- **Destacar no pedido:** uso das versões CT/MRI v2018, Nonradiation TRA v2024 e Radiation TRA v2024; ausência de reprodução dos PDFs, tabelas e figuras; diferenças deliberadas de escopo descritas em `docs/LI-RADS.md`.
- **Evidência exigida:** resposta ou licença escrita com as condições de uso, tradução, atualização, atribuição e apresentação das marcas.

### P-03 — AO/OTA Fracture and Dislocation Classification Compendium—2018

- **Status:** `PENDENTE`.
- **Titulares a consultar:** AO Foundation e Orthopaedic Trauma Association (OTA). O compêndio identifica copyright conjunto das duas organizações.
- **Ponto de partida:** [página oficial da classificação AO/OTA](https://www.aofoundation.org/trauma/clinical-library-and-tools/journals-and-publications/classification) e [contato da AO Foundation](https://www.aofoundation.org/who-we-are/contact).
- **Solicitar autorização ou confirmação escrita para:** árvore de códigos AO/OTA; nomenclatura das regiões, tipos, grupos e subgrupos; PCCF; modificadores de luxação; tradução PT/EN; uso nominativo das marcas `AO`, `OTA` e `AO/OTA`; implementação interativa em software aberto e eventual distribuição comercial.
- **Incluir no pedido:** o módulo é textual, tem cobertura parcial declarada e não contém PDFs, tabelas, pôsteres, desenhos, logotipos ou pranchas da AO/OTA.
- **Motivo do bloqueio:** os [termos da AO Foundation](https://www.aofoundation.org/disclaimer) limitam reprodução, exploração comercial e criação de obras derivadas de material AO sem permissão escrita. A disponibilidade gratuita ou para uso pessoal não concede automaticamente direito de redistribuição em outro aplicativo.
- **Evidência exigida:** autorização conjunta ou confirmações suficientes de todos os titulares pertinentes, incluindo regras de atribuição, marca, versões, plataformas e comercialização.

### P-04 — OTA Open Fracture Classification e UCPF

- **Status:** `PENDENTE`.
- **Responsável pela análise:** assessoria jurídica de propriedade intelectual.
- **Ação:** identificar, em cada artigo original, quem controla os direitos da classificação, do texto e da publicação; consultar OTA, autores, editor e/ou RightsLink conforme o resultado.
- **Solicitar ou confirmar:** permissão para implementar a estrutura de cinco componentes da OTA-OFC e os códigos da UCPF, inclusive tradução e apresentação interativa.
- **Evidência exigida:** licença do titular ou parecer escrito concluindo que a implementação autoral atual não exige licença adicional, com indicação do conteúdo que pode permanecer.

### P-05 — Escalas de lesão AAST

- **Status:** `PENDENTE`.
- **Titular indicado pela fonte:** a AAST informa que não detém o copyright das tabelas e orienta solicitar permissão à Wolters Kluwer pelo RightsLink de cada artigo original. Consulte a [orientação oficial da AAST](https://www.aast.org/resources/trauma-tools/injury-scoring-scale.html).
- **Solicitar autorização para:** representação digital adaptada e resumida das 32 escalas; tradução PT/EN; critérios de cada grau; ferramenta específica para baço, fígado e rim da revisão de 2018; distribuição aberta e eventual uso comercial.
- **O pedido deve esclarecer:** não há reprodução do layout, códigos ICD, PDFs ou tabelas originais; o conteúdo é condensado e parafraseado, mas preserva graus e critérios clínicos.
- **Evidência exigida:** licença RightsLink/Wolters Kluwer para todos os artigos aplicáveis ou parecer escrito delimitando quais elementos factuais podem ser mantidos sem licença.

### P-06 — Fleischner Society 2017 e Bosniak v2019

- **Status:** `PENDENTE`.
- **Titular/editor a consultar:** Radiological Society of North America (RSNA), conforme a licença de cada artigo.
- **Ação:** confirmar se cada artigo usado está sob licença aberta e quais condições se aplicam. A RSNA informa que acesso marcado apenas como gratuito não autoriza reutilização; conteúdo não aberto exige pedido pelo RightsLink. Consulte [RSNA Permissions and Policies](https://www.rsna.org/journals/permissions-and-policies).
- **Solicitar autorização quando aplicável para:** adaptação das regras em software, tradução, textos de recomendação, classificação interativa e distribuição nas plataformas pretendidas.
- **Evidência exigida:** licença aberta arquivada com sua versão e obrigações, licença RightsLink ou parecer jurídico escrito que delimite a implementação permitida.

### P-07 — Modelo Brock/PanCan e recomendações CUA 2023

- **Status:** `PENDENTE`.
- **Responsável pela análise:** assessoria jurídica de propriedade intelectual.
- **Ação Brock:** confirmar com o editor da publicação original se a implementação dos coeficientes e da fórmula, assim como o nome `Brock/PanCan`, requer autorização para distribuição em software.
- **Ação CUA:** registrar a licença exata da versão da diretriz utilizada e verificar se ela permite adaptação, tradução e eventual uso comercial.
- **Evidência exigida:** termos/licenças arquivados ou respostas escritas dos titulares; se a conclusão for dispensa, parecer que diferencie fatos, fórmulas, métodos e redação protegida.

### P-08 — Marcas e nome do aplicativo

- **Status:** `PENDENTE`.
- **Ação:** realizar pesquisa de anterioridade para `RadRef` no INPI e nos territórios de distribuição; verificar nomes semelhantes em software médico e lojas.
- **Ação adicional:** confirmar que screenshots, ícones, metadados e materiais promocionais não sugerem afiliação, certificação ou endosso por ACR, AO Foundation, OTA, AAST, RSNA, CUA ou outras entidades.
- **Evidência exigida:** relatório de busca e aprovação jurídica do nome; autorização escrita antes de usar logotipo, selo, identidade visual ou alegação de parceria de terceiros.

## 2. Regularização sanitária no Brasil

### P-09 — Enquadramento do RadRef como SaMD

- **Status:** `PENDENTE`.
- **Responsável:** profissional ou consultoria regulatória com experiência em software médico no Brasil.
- **Ação:** formalizar a finalidade pretendida, usuários, indicações, entradas, saídas, alegações, riscos e papel do aplicativo na decisão clínica; então emitir análise de enquadramento sob a RDC 657/2022 e a Regra 12 da RDC 751/2022.
- **Fonte oficial:** [perguntas e respostas da ANVISA sobre a RDC 657/2022](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas) e [visão regulatória de dispositivos médicos](https://www.gov.br/anvisa/en/regulation-of-products/medical-devices).
- **Evidência exigida:** parecer regulatório assinado concluindo `SaMD` ou `não regulado`, com justificativa, classe de risco quando aplicável e limites de alegações permitidos.
- **Regra:** o aviso “uso educacional” não deve ser usado como substituto para a análise da função e da finalidade reais do software.

### P-10 — Notificação ou registro na ANVISA, se aplicável

- **Status:** `PENDENTE`, dependente de P-09.
- **Se o RadRef for SaMD:** identificar a empresa legal responsável, regularização/AFE aplicável, classe de risco, regime de notificação ou registro, documentação técnica, evidência clínica, gerenciamento de risco, segurança, rotulagem/instruções de uso e obrigações pós-mercado.
- **Ação:** obter o ato de regularização aplicável antes de oferecer o produto no Brasil e fazer as descrições do app e das lojas coincidirem com a finalidade autorizada.
- **Evidência exigida:** número de notificação/registro e documentos oficiais correspondentes, ou fundamento formal de dispensa quando aplicável.

### P-11 — Outros países e territórios

- **Status:** `PENDENTE`.
- **Ação:** limitar inicialmente a disponibilidade ao Brasil ou obter avaliação regulatória específica para cada território antes de habilitá-lo.
- **Evidência exigida:** matriz de países com classificação regulatória, representante/fabricante legal quando necessário e número de autorização, registro, clearance ou dispensa.

## 3. Aprovações clínicas e de segurança

### P-12 — Revisão clínica independente

- **Status:** `PENDENTE`.
- **Ação:** obter revisão documentada por especialistas independentes para cada módulo:
  - radiologia torácica: Fleischner, Lung-RADS e Brock;
  - radiologia abdominal/urorradiologia e urologia: Bosniak e CUA;
  - radiologia abdominal/hepatologia: LI-RADS diagnóstico e TRA;
  - radiologia musculoesquelética/ortopedia: AO/OTA, OTA-OFC, PCCF, UCPF e luxações;
  - radiologia de emergência/cirurgia do trauma: escalas AAST.
- **Escopo mínimo:** fidelidade às versões citadas, tradução, limites, unidades, desempates, guardrails, texto compartilhável e situações não cobertas.
- **Evidência exigida:** relatório assinado, conflitos documentados, correções concluídas e aprovação final da versão candidata.

### P-13 — Validação de segurança e gestão de mudanças

- **Status:** `PENDENTE`.
- **Ação:** definir responsável clínico, controle de versões das fontes, processo de atualização, registro de risco, critérios de retirada/correção e canal público para comunicar erro clínico.
- **Evidência exigida:** plano aprovado e versão candidata rastreável até testes, revisão clínica e fontes utilizadas.

### P-14 — Uso em pesquisa ou com dados reais

- **Status:** `NÃO APLICÁVEL` para a versão atual, desde que não sejam coletados dados de pacientes nem conduzida pesquisa com participantes.
- **Regra de reabertura:** antes de estudo prospectivo, coleta de dados, telemetria clínica ou validação com participantes, obter avaliação do CEP/CONEP ou comitê de ética competente, consentimento quando exigido e aprovação institucional.

## 4. Privacidade, termos e publicação nas lojas

### P-15 — Política de privacidade e termos de uso

- **Status:** `PENDENTE`.
- **Ação:** publicar política de privacidade em URL pública e não georrestrita, mesmo que a versão atual declare não coletar dados; documentar links externos, compartilhamento local, logs, telemetria, crash reporting e qualquer serviço que venha a ser adicionado.
- **Ação adicional:** obter revisão jurídica dos termos de uso, limitações de responsabilidade, público profissional, suporte, jurisdição e linguagem de uso educacional.
- **Evidência exigida:** URLs e versões aprovadas dos documentos, coerentes com o comportamento efetivo do aplicativo.

### P-16 — Apple App Store

- **Status:** `PENDENTE`.
- **Ação:** publicar por entidade jurídica adequada, preencher declarações de privacidade, apresentar metodologia/evidências de exatidão e anexar documentação regulatória quando aplicável.
- **Fonte oficial:** a [App Review Guideline 1.4.1](https://developer.apple.com/app-store/review/guidelines/#physical-harm) prevê escrutínio reforçado para apps médicos que apoiem diagnóstico ou tratamento e solicita documentação de clearance regulatório quando existente.
- **Evidência exigida:** conta/contrato do Apple Developer Program, aprovação do App Review e arquivo de todas as declarações e documentos enviados.

### P-17 — Google Play

- **Status:** `PENDENTE`.
- **Ação:** preencher corretamente a declaração de Health apps, classificar a funcionalidade como Clinical Decision Support ou Medical Device conforme P-09, disponibilizar política de privacidade e fornecer prova regulatória ou disclaimer compatível com o enquadramento.
- **Fonte oficial:** [Google Play — Health Content and Services](https://support.google.com/googleplay/android-developer/answer/16679511) e [Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291).
- **Evidência exigida:** conta/contrato do Play Console, declaração arquivada, aprovação da revisão e documentos regulatórios apresentados.

### P-18 — Dependências e ativos próprios

- **Status:** `PENDENTE`.
- **Ação:** auditar licenças de todas as dependências incluídas no pacote e gerar os avisos de terceiros exigidos.
- **Ação adicional:** arquivar prova de autoria/licença do ícone, splash, favicon, fontes e demais recursos gráficos; confirmar que nenhum ativo removido permanece no pacote ou no histórico público.
- **Evidência exigida:** relatório de licenças, arquivo de notices, inventário de ativos e scan final do artefato distribuído.

### P-19 — Histórico Git e publicação do código

- **Status:** `PENDENTE`.
- **Ação:** reescrever o histórico antes da primeira publicação pública para eliminar PDFs e pranchas de terceiros já versionados; verificar refs, tags, branches, releases e objetos alcançáveis.
- **Ação adicional:** executar varredura de segredos, dados pessoais, arquivos licenciados e binários antes do push público.
- **Evidência exigida:** relatório da limpeza/varredura, revisão do diff final e aprovação explícita do proprietário do repositório.

## 5. Registro das solicitações

Preencher uma linha para cada contato ou decisão. Os documentos recebidos devem ser armazenados fora do repositório público quando contiverem dados pessoais, valores, cláusulas confidenciais ou assinaturas.

| ID | Titular/órgão | Responsável | Data do pedido | Protocolo | Status | Evidência/local seguro |
| --- | --- | --- | --- | --- | --- | --- |
| P-01 | ACR — Lung-RADS | Não atribuído | — | — | PENDENTE | — |
| P-02 | ACR — LI-RADS | Não atribuído | — | — | PENDENTE | — |
| P-03 | AO Foundation/OTA | Não atribuído | — | — | PENDENTE | — |
| P-04 | OTA-OFC/UCPF | Não atribuído | — | — | PENDENTE | — |
| P-05 | Wolters Kluwer/RightsLink — AAST | Não atribuído | — | — | PENDENTE | — |
| P-06 | RSNA — Fleischner/Bosniak | Não atribuído | — | — | PENDENTE | — |
| P-07 | Brock/PanCan e CUA | Não atribuído | — | — | PENDENTE | — |
| P-08 | Nome e marcas | Não atribuído | — | — | PENDENTE | — |
| P-09 | Enquadramento ANVISA | Não atribuído | — | — | PENDENTE | — |
| P-10 | Regularização ANVISA | Não atribuído | — | — | PENDENTE | — |
| P-11 | Outros territórios | Não atribuído | — | — | PENDENTE | — |
| P-12 | Revisão clínica | Não atribuído | — | — | PENDENTE | — |
| P-13 | Segurança clínica | Não atribuído | — | — | PENDENTE | — |
| P-14 | Ética em pesquisa | Não atribuído | — | — | NÃO APLICÁVEL | Reavaliar se o escopo mudar |
| P-15 | Privacidade e termos | Não atribuído | — | — | PENDENTE | — |
| P-16 | Apple | Não atribuído | — | — | PENDENTE | — |
| P-17 | Google | Não atribuído | — | — | PENDENTE | — |
| P-18 | Dependências e ativos | Não atribuído | — | — | PENDENTE | — |
| P-19 | Histórico Git | Não atribuído | — | — | PENDENTE | — |

## 6. Critério de liberação

Uma versão somente pode receber aprovação para publicação externa quando:

- [ ] todos os itens aplicáveis estiverem `AUTORIZADO` ou `NÃO APLICÁVEL` com evidência;
- [ ] as permissões cobrirem versão, idioma, plataforma, território e modelo comercial pretendidos;
- [ ] a finalidade e as alegações públicas coincidirem com o enquadramento regulatório;
- [ ] a revisão clínica independente da versão candidata estiver aprovada;
- [ ] política de privacidade, termos, suporte e procedimento de correção estiverem publicados;
- [ ] o artefato final e o histórico Git estiverem livres de material não autorizado e segredos;
- [ ] a documentação das lojas estiver consistente com o aplicativo e com a autorização sanitária;
- [ ] o proprietário do produto tiver assinado a decisão final de lançamento.

## 7. Alterações que reabrem a análise

Reavaliar as autorizações antes de qualquer lançamento que inclua:

- nova versão de uma classificação ou diretriz;
- novo idioma, país, plataforma ou modelo de monetização;
- uso de tabelas, imagens, logotipos, layouts ou texto literal de terceiros;
- alegação de diagnóstico, prognóstico, recomendação terapêutica ou substituição de julgamento profissional;
- armazenamento, transmissão, analytics ou integração com dados de pacientes;
- associação institucional, endosso, certificação ou parceria com terceiros;
- uso do aplicativo em pesquisa com participantes humanos.

Última revisão deste checklist: **16 de agosto de 2026**.
