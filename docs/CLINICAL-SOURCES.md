# Fontes clínicas e versões implementadas

## Nódulos pulmonares

### Fleischner Society 2017

MacMahon H, Naidich DP, Goo JM, et al. Guidelines for Management of Incidental Pulmonary Nodules Detected on CT Images: From the Fleischner Society 2017. *Radiology*. 2017;284(1):228–243.

- DOI: https://doi.org/10.1148/radiol.2017161659
- Versão implementada: recomendações de 2017.
- Escopo operacional no RadRef: nódulos incidentais em adultos com 35 anos ou mais; não usar para rastreamento, câncer primário conhecido ou imunossupressão.

### ACR Lung-RADS v2022

American College of Radiology. Lung CT Screening Reporting & Data System, version 2022.

- Página oficial: https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/Lung-RADS
- Versão implementada: 2022.
- Escopo operacional no RadRef: TC de rastreamento de câncer pulmonar.
- Nota: a versão 2022 não mantém uma coluna oficial de percentual de malignidade por categoria; o aplicativo não atribui esses percentuais.

### Modelo Brock/PanCan completo

McWilliams A, Tammemagi MC, Mayo JR, et al. Probability of Cancer in Pulmonary Nodules Detected on First Screening CT. *N Engl J Med*. 2013;369:910–919.

- DOI: https://doi.org/10.1056/NEJMoa1214726
- Fórmula implementada: full model publicado.
- O RadRef calcula a probabilidade; não transforma o resultado em diagnóstico ou ordem de manejo independente.

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

## Limiar de realce usado no módulo renal

O aplicativo preserva os limiares operacionais dos projetos-fonte e das referências adotadas:

- TC: aumento `≥20 HU` confirma realce; `10–19,9 HU` é indeterminado; `<10 HU` não confirma.
- RM: aumento de sinal `≥15%` confirma realce quantitativo.
- Realce visual inequívoco pode ser aceito independentemente do cálculo numérico.

## Hierarquia de uso

Quando houver conflito entre o RadRef, uma política institucional e a publicação original, a fonte primária e o contexto clínico prevalecem. O aplicativo identifica a versão implementada para permitir auditoria e atualização futura.
