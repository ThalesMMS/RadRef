# Fontes clínicas e versões implementadas

## Nódulos pulmonares

### Fleischner Society 2017

MacMahon H, Naidich DP, Goo JM, et al. Guidelines for Management of Incidental Pulmonary Nodules Detected on CT Images: From the Fleischner Society 2017. *Radiology*. 2017;284(1):228–243.

- DOI: https://doi.org/10.1148/radiol.2017161659
- Versão implementada: 2017.
- Escopo operacional: nódulos incidentais em adultos com 35 anos ou mais; não usar para rastreamento, câncer primário conhecido ou imunossupressão.

### ACR Lung-RADS v2022

American College of Radiology. Lung CT Screening Reporting & Data System, version 2022.

- Página oficial: https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/Lung-RADS
- Versão implementada: 2022.
- Escopo operacional: TC de rastreamento de câncer pulmonar.
- A versão 2022 não mantém coluna oficial de percentual de malignidade por categoria; o RadRef não atribui esses percentuais.

### Modelo Brock/PanCan completo

McWilliams A, Tammemagi MC, Mayo JR, et al. Probability of Cancer in Pulmonary Nodules Detected on First Screening CT. *N Engl J Med*. 2013;369:910–919.

- DOI: https://doi.org/10.1056/NEJMoa1214726
- Fórmula implementada: full model publicado.
- O resultado é uma probabilidade calculada, não diagnóstico nem ordem de manejo independente.

## Lesões císticas renais

### Bosniak v2019

Silverman SG, Pedrosa I, Ellis JH, et al. Bosniak Classification of Cystic Renal Masses, Version 2019: An Update Proposal and Needs Assessment. *Radiology*. 2019;292(2):475–488.

- DOI: https://doi.org/10.1148/radiol.2019182646
- Versão implementada: 2019.

### Guia pictórico de aplicação

Schieda N, Davenport MS, Krishna S, et al. Bosniak Classification of Cystic Renal Masses Version 2019: A Pictorial Guide to Clinical Use. *RadioGraphics*. 2021;41(3):814–828.

- DOI: https://doi.org/10.1148/rg.2021200160

### Armadilhas de interpretação

Edney E, Davenport MS, Curci N, et al. Bosniak Classification of Cystic Renal Masses, Version 2019: Interpretation Pitfalls and Recommendations to Avoid Misclassification. *Abdom Radiol*. 2022.

- Texto aberto: https://pmc.ncbi.nlm.nih.gov/articles/PMC8751648/

### RM de massas renais císticas

Krishna S, Schieda N, Pedrosa I, et al. Update on MRI of Cystic Renal Masses Including Bosniak Version 2019. *J Magn Reson Imaging*. 2021.

- Texto aberto: https://pmc.ncbi.nlm.nih.gov/articles/PMC8017011/

### CUA 2023

Richard PO, Violette PD, Jewett MAS, et al. 2023 UPDATE — Canadian Urological Association guideline: Management of cystic renal lesions. *Can Urol Assoc J*. 2023;17(6):162–174.

- DOI: https://doi.org/10.5489/cuaj.8389
- Texto aberto: https://pmc.ncbi.nlm.nih.gov/articles/PMC10263289/
- Versão implementada: atualização de 2023.

### Limiares operacionais de realce

- TC: aumento `≥20 HU` confirma realce; `10–19,9 HU` é indeterminado; `<10 HU` não confirma.
- RM: aumento de sinal `≥15%` confirma realce quantitativo.
- Realce visual inequívoco pode ser aceito independentemente do cálculo numérico.

## Fraturas e luxações

### AO/OTA Fracture and Dislocation Classification Compendium—2018

Meinberg EG, Agel J, Roberts CS, Karam MD, Kellam JF. Fracture and Dislocation Classification Compendium—2018. *J Orthop Trauma*. 2018;32(Suppl 1):S1–S170.

- DOI da introdução: https://doi.org/10.1097/BOT.0000000000001063
- Versão implementada: revisão de 2018.
- Escopo usado no RadRef:
  - localização e códigos de fraturas adultas;
  - tipos, grupos e subgrupos selecionados;
  - qualificadores diafisários por terço;
  - OTA Open Fracture Classification;
  - classificação pediátrica PCCF;
  - UCPF para fraturas periprotéticas;
  - códigos de luxação e direção.

O compêndio integra ou referencia outras classificações, incluindo Neer, Pauwels, Young–Burgess, Letournel, Hawkins, Sanders, AOSpine e a classificação unificada periprotética. O RadRef não implementa integralmente todas essas qualificações ou todas as combinações raras.

### OTA Open Fracture Classification

Orthopaedic Trauma Association: Open Fracture Study Group. A new classification scheme for open fractures. *J Orthop Trauma*. 2010;24(8):457–464.

- DOI: https://doi.org/10.1097/BOT.0b013e3181c7cb43
- Implementação: cinco componentes independentes — pele, músculo, arterial, contaminação e perda óssea.
- A classificação foi concebida para aplicação no desbridamento inicial pelo cirurgião; a ferramenta radiológica não substitui avaliação operatória.

### AO Pediatric Comprehensive Classification of Long Bone Fractures

A PCCF incorporada ao compêndio de 2018 é usada para gerar códigos de fraturas dos ossos longos pediátricos por osso, segmento, subsegmento, padrão, gravidade e qualificação opcional.

### Unified Classification System for Periprosthetic Fractures

Duncan CP, Haddad FS. The Unified Classification System (UCS): improving our understanding of periprosthetic fractures. *Bone Joint J*. 2014;96-B(6):713–716.

- DOI: https://doi.org/10.1302/0301-620X.96B6.34040
- No RadRef, o código UCPF é apresentado como modificador a ser acrescentado após o código ósseo AO/OTA.

### Limites de cobertura do módulo de Fraturas

- O navegador adulto cobre todas as regiões principais representadas pelo registro do aplicativo, mas não todas as figuras, qualificações específicas, modificadores universais ou subgrupos do compêndio.
- A classificação final pode depender de TC, RM, radiografias adicionais, redução ou achados operatórios.
- Em dúvida, a publicação original e a avaliação especializada prevalecem.

## Trauma — AAST

### AAST Injury Scoring Scale

American Association for the Surgery of Trauma. Injury Scoring Scale: A Resource for Trauma Care Professionals.

- Página oficial: https://www.aast.org/resources-detail/injury-scoring-scale
- Material fornecido ao projeto: cópia arquivada contendo 32 escalas, distribuídas por pescoço, tórax, abdome, geniturinário, pelve/reprodutivo e extremidades.
- Implementação: navegador de referência com critérios condensados e parafraseados por grau.

As escalas históricas não são uniformes: algumas são predominantemente anatômicas/operatórias, algumas incluem achados de imagem e algumas cópias arquivadas apresentam linhas vazias ou formatação incompleta no grau mais alto. O RadRef não preenche conteúdo ausente por inferência.

### Revisão AAST 2018 — baço, fígado e rim

Kozar RA, Crandall M, Shanmuganathan K, et al. Organ injury scaling 2018 update: Spleen, liver, and kidney. *J Trauma Acute Care Surg*. 2018;85(6):1119–1122.

- DOI: https://doi.org/10.1097/TA.0000000000002058
- Versão implementada: 2018.
- Escopo da ferramenta: critérios tomográficos de graduação, com AIS e notas de aplicação.
- A revisão incorpora lesão vascular diagnosticada por TC e diferencia sangramento contido daquele que se estende além do órgão/compartimento.
- A publicação recomenda fases arterial e portal venosa para avaliação de lesões vasculares de órgãos sólidos; suspeita de trauma renal exige também fase excretora tardia.
- O maior grau encontrado entre critérios de imagem, operatórios ou patológicos determina o grau final na escala original.

A ferramenta não recomenda observação, embolização ou cirurgia. Manejo depende de estabilidade hemodinâmica, lesões associadas, recursos locais e avaliação da equipe de trauma.

## Direitos de reprodução

- O compêndio AO/OTA autoriza uso de sua classificação e figuras para pesquisa, educação e finalidade médica, mas informa que uso comercial/lucrativo exige permissão.
- A página AAST fornecida declara que a AAST não detém o copyright das tabelas publicadas e orienta solicitar licença à editora para reprodução formal.
- Para textos e tabelas, o RadRef preserva códigos e conceitos clínicos, usa descrições condensadas/parafraseadas e não redistribui as páginas originais.
- Exceção: o módulo de fraturas exibe as pranchas de ilustração do compêndio AO/OTA 2018 (`assets/fracture/aoota-2018`), extraídas do PDF em `references/` por `scripts/extract-fracture-illustrations.py`. O script enquadra a ilustração em si — o desenho, suas chamadas e os códigos de classificação — e remove o texto corrido da página; nenhuma página do suplemento é redistribuída. Cada prancha é creditada na tela com a página impressa (S__). O uso se apoia na autorização educacional/médica do compêndio; distribuição comercial exige permissão prévia da AO Foundation/OTA.

## Hierarquia de uso

Quando houver conflito entre o RadRef, política institucional e publicação original, a fonte primária e o contexto clínico prevalecem. A versão implementada é exibida para facilitar auditoria e atualização futura.
