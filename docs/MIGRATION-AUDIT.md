# Auditoria dos projetos Swift, plano de migração e expansão clínica

## Escopo da inspeção

Foram extraídos e examinados os dois ZIPs fornecidos. A inspeção cobriu:

- estrutura de projeto e targets;
- telas e fluxos SwiftUI;
- models, view models e parsers;
- regras, limites e precedência de classificação;
- textos clínicos e arquivos de localização;
- referências, PDFs e CSVs de casos-limite;
- testes unitários, edge cases e documentação de conformidade.

## 1. Projeto `Lung-Nodule-dev`

### Inventário encontrado

A aplicação SwiftUI apresentava um fluxo concentrado em `ContentView` e três ferramentas de domínio:

- `FleischnerModel.swift` / `FleischnerViewModel.swift` / `FleischnerView.swift`;
- `LungRADSModel.swift` / `LungRADSViewModel.swift` / `LungRADSView.swift`;
- `BrockModel.swift` / `BrockViewModel.swift` / `BrockView.swift`.

Recursos auxiliares:

- telas de questões frequentes e pontos críticos de Fleischner e Lung-RADS;
- calculadora de crescimento e conversão de volume;
- checklist informativo do modificador S;
- visualizador de PDFs do bundle;
- strings localizáveis;
- extensa suíte XCTest e CSV de casos-limite.

### Fluxos preservados no RadRef

- seleção entre ferramenta Fleischner, Lung-RADS, Brock e referências;
- entradas morfológicas e métricas relevantes;
- classificação e manejo em tempo real;
- alertas de escopo e aplicação;
- pontos críticos antes distribuídos nas telas auxiliares;
- referências bibliográficas.

### Divergências clínicas identificadas

#### A. Lung-RADS v2022: percentuais de malignidade

O projeto Swift ainda continha frases com percentuais históricos de malignidade. O ACR retirou a coluna de risco estimado da tabela da versão 2022. O RadRef não apresenta esses percentuais como propriedade oficial da categoria.

#### B. Cistos pulmonares atípicos

O Swift tratava de forma ampla qualquer cisto atípico basal como 4A e usava uma regra simplificada para seguimento. A reconstrução segue as características explícitas da versão 2022:

- crescimento do componente cístico de cisto de parede espessa: categoria 3;
- cisto de parede espessa ou multiloculado basal, ou que se torna multiloculado: 4A;
- crescimento de parede/nodularidade, crescimento do componente multiloculado, aumento de loculações ou nova/aumentada opacidade: 4B;
- nódulo associado: prevalece a característica mais preocupante.

#### C. Nódulo sólido único maior que 8 mm — Fleischner

O texto Swift dizia para considerar PET/TC ou amostragem apenas “se o crescimento persistir”. A tabela original recomenda considerar TC em 3 meses, PET/TC ou amostragem tecidual, individualizando pelo risco e contexto. O RadRef usa essa formulação corrigida.

#### D. Morfologia juxtapleural

O limiar benigno do Lung-RADS v2022 é **menor que 10 mm**. Um nódulo de 10,0 mm não entra automaticamente nessa regra. O RadRef testa explicitamente esse limite.

#### E. Nódulo de via aérea

A reconstrução diferencia:

- localização subsegmentar;
- localização segmentar ou mais proximal;
- persistência/crescimento;
- características benignas de secreção e ausência de nódulo de partes moles subjacente.

Isso substitui um campo auxiliar do Swift cuja formulação não representava adequadamente o critério da versão 2022.

#### F. 4X e modificador S

O RadRef mantém 4X como elevação da categoria por características adicionais suspeitas. O modificador S permanece separado, pois descreve achado clinicamente significativo não relacionado ao câncer pulmonar e não altera por si só a categoria numérica.

#### G. Crescimento lento

A versão 2022 diz que nódulos sólidos ou parcialmente sólidos de crescimento lento “podem” ser classificados como 4B. Para produzir um resultado determinístico e evitar subestimativa, o RadRef adota 4B e documenta a suposição na tela About e no resultado.

### Brock

A fórmula logística, os coeficientes e as codificações de sexo, enfisema, história familiar, tipo do nódulo, localização, número de nódulos e espiculação foram preservados. Foram acrescentadas validações explícitas para idade, diâmetro implementado de 3–30 mm e contagem inteira positiva.

As faixas de risco exibidas são rotuladas como operacionais, porque não fazem parte da saída matemática original do modelo.

## 2. Projeto `Bosniak-Renal-Cyst-dev`

### Inventário encontrado

O projeto tinha separação clara entre núcleo e SwiftUI:

- `BosniakCalculator.swift` e `BosniakModel.swift`;
- `EnhancementModel.swift`;
- `ManagementModel.swift`;
- parser numérico independente;
- view models e telas para classificação, realce, manejo, questões frequentes e referências;
- pacote Swift para testar o núcleo em Linux/macOS;
- CSV de casos-limite e notas de auditoria.

### Resultado da auditoria

A lógica estava, em linhas gerais, coerente com Bosniak v2019 e CUA 2023. Foram preservados:

- aplicabilidade somente a massa predominantemente cística, com menos de aproximadamente 25% de tecido realçante;
- exclusão de etiologias infecciosas, inflamatórias, vasculares e contexto sindrômico hereditário;
- necessidade de TC/RM apropriada para demonstrar realce;
- critérios quantitativos de parede e septos;
- distinção entre protrusão de margens agudas e obtusas;
- padrões especiais Bosniak II e IIF específicos por modalidade;
- precauções com calcificação e heterogeneidade;
- cálculo de realce em TC/RM;
- separação entre classe radiológica e manejo;
- faixas de tamanho CUA 2023.

### Ajustes e guardrails mantidos

- ultrassom isolado para lesão complexa retorna caracterização incompleta;
- aquisição sem contraste não pode confirmar estrutura realçante;
- calcificação abundante/espessa/nodular em TC pode exigir RM com subtração;
- massa heterogênea sem realce demonstrado em TC exige RM antes da classe final;
- parede ou septo espessado sem realce não é automaticamente IIF/III;
- combinação rara não padronizada solicita revisão, em vez de forçar classe;
- manejo não modifica a classificação.

### Divergência documental de testes

`Notes/AuditSummary.md` e `Notes/TestResults.md` declaravam 43 testes. A execução do pacote Swift fornecido em 23 de julho de 2026 resultou em **45 testes, 0 falhas**. O README mais recente já dizia 45. O RadRef registra a contagem efetiva e não replica a documentação desatualizada.

## 3. Plano de migração executado

### Etapa 1 — extração do comportamento

As regras foram convertidas em tabelas mentais de decisão e casos-limite, sem portar sintaxe Swift ou arquitetura MVVM literalmente.

### Etapa 2 — domínio TypeScript puro

Na etapa inicial foram criados seis motores independentes:

```text
lung/domain/fleischner.ts
lung/domain/lungRads.ts
lung/domain/brock.ts
renal/domain/bosniak.ts
renal/domain/enhancement.ts
renal/domain/management.ts
```

### Etapa 3 — testes antes da interface

Os limites e conflitos auditados foram fixados em testes TypeScript. A interface foi construída somente depois de estabilizar os resultados do domínio.

### Etapa 4 — design system e i18n

Entradas, resultados, alertas, cartões, cabeçalho e referências foram unificados. Todos os textos clínicos passaram para dicionários EN/PT.

### Etapa 5 — navegação modular

Expo Router fornece rotas por arquivo. Um registro declarativo alimenta a home e permite acrescentar módulos sem acoplamento ao domínio existente.

### Etapa 6 — documentação e referências

Foram mantidos os metadados bibliográficos e links oficiais. PDFs locais não foram copiados para evitar redistribuição desnecessária de conteúdo protegido.

## 4. Funcionalidades que não foram migradas fielmente

- Não houve réplica pixel a pixel das telas SwiftUI; a experiência foi redesenhada para React Native e coerência entre módulos.
- O `PDFKit`/visualizador de PDF específico de iOS foi substituído por abertura de links externos oficiais.
- Controles, folhas e ações exclusivos do ecossistema Apple foram substituídos por componentes multiplataforma.
- Não foi preservada a estrutura ViewModel por tela. O React usa estado local e chama funções de domínio puras, reduzindo camadas sem perder separação de responsabilidades.
- Não foram incluídos PDFs embutidos dos ZIPs.
- O checklist extenso do modificador S foi consolidado em controle, explicação e pontos críticos; não foi reproduzido como uma lista autônoma item a item.
- Não foi criada integração com DICOM, PACS, servidor ou cadastro de pacientes, porque o comportamento-fonte era manual e local.

## 5. Riscos residuais

- A aplicação não passou por validação prospectiva, estudo de usabilidade clínica, avaliação regulatória ou análise de risco de software médico.
- Fórmulas e decisões dependem da qualidade das medidas e da correta seleção do contexto pelo usuário.
- Diretrizes futuras podem alterar categorias, textos ou manejo; a versão de cada fonte deve permanecer visível e atualizada de forma controlada.
- Resultados raros ou clinicamente conflitantes devem ser confrontados com a publicação original e política local.

## 6. Expansão da versão 1.1 — Fraturas

### Fontes inspecionadas

Foi analisado o *Fracture and Dislocation Classification Compendium—2018*, com atenção a:

- princípios de localização por osso e segmento;
- morfologia diafisária e de segmentos terminais;
- códigos por tipo, grupo e subgrupo;
- qualificações e modificadores universais;
- OTA Open Fracture Classification;
- luxações;
- PCCF pediátrica;
- UCPF periprotética;
- coluna, sacro e tórax.

### Estratégia de implementação

Uma reprodução integral das 173 páginas produziria uma interface excessivamente extensa e aumentaria o risco de copiar figuras/tabelas protegidas. A implementação foi dividida em cinco ferramentas práticas:

1. navegador adulto AO/OTA;
2. OTA-OFC;
3. PCCF pediátrica;
4. UCPF;
5. luxações.

O navegador adulto usa um registro hierárquico tipado, em vez de centenas de condicionais. Ele cobre 31 regiões principais e preserva o encadeamento tipo → grupo → subgrupo. Para regiões diafisárias, o usuário pode acrescentar a qualificação de terço proximal, médio ou distal.

### Cobertura deliberadamente parcial

O módulo não reproduz integralmente:

- todas as qualificações específicas;
- todos os modificadores universais;
- todas as combinações de mão, pé e falanges;
- todos os subgrupos raros;
- figuras e diagramas do compêndio;
- algoritmos de tratamento.

A tela avisa que o código final pode depender de informações adicionais, redução ou achado operatório e que o compêndio original é definitivo.

### Decisões específicas

- Rádio/ulna e tíbia/fíbula permanecem codificados de forma independente quando o compêndio assim determina.
- O código maleolar é separado do código isolado da fíbula distal.
- OTA-OFC preserva cinco componentes independentes e não cria uma pontuação composta inexistente.
- PCCF gera código estruturado, mas não tenta validar maturidade esquelética ou prognóstico.
- UCPF gera o modificador `[articulação + tipo]`; a avaliação de estabilidade do implante e estoque ósseo continua dependente do caso.
- Luxações usam a posição do osso distal e o modificador de direção, conforme a convenção do compêndio.

## 7. Expansão da versão 1.1 — Trauma AAST

### Fontes inspecionadas

Foram analisados:

- a cópia arquivada da página AAST *Injury Scoring Scale*, com 32 tabelas;
- o artigo de revisão de 2018 para baço, fígado e rim.

### Estratégia de implementação

As escalas AAST foram representadas como um registro de dados com:

- identificador;
- região anatômica;
- título e versão;
- graus disponíveis;
- critérios condensados;
- AIS quando explicitamente disponível;
- notas de multiplicidade, bilateralidade ou ajuste vascular.

A ferramenta de órgãos sólidos foi mantida separada porque os critérios de TC de 2018 têm uso radiológico direto e lógica de classificação específica.

### Tratamento de inconsistências da fonte

A cópia arquivada apresenta formatação incompleta em alguns graus máximos e mistura tabelas de diferentes épocas. Foram adotadas as seguintes regras:

- não preencher por inferência linhas ausentes;
- marcar a versão como histórica/legada quando não há revisão de 2018;
- manter notas explícitas quando o maior grau está em branco na fonte arquivada;
- não converter a graduação em recomendação terapêutica;
- não reproduzir códigos ICD-9, pois não são necessários ao objetivo radiológico do aplicativo.

### Direitos e redação

A página AAST informa que a associação não detém o copyright das tabelas e orienta solicitar permissão à editora para reprodução. Por isso, o conteúdo foi resumido e parafraseado. O projeto não incorpora imagens ou tabelas originais.

## 8. Arquivos de domínio adicionados na versão 1.1

```text
fracture/domain/adultAoOta.ts
fracture/domain/openFracture.ts
fracture/domain/pediatric.ts
fracture/domain/periprosthetic.ts
fracture/domain/dislocations.ts
trauma/domain/aastScales.ts
trauma/domain/solidOrgan.ts
```

Cada conjunto possui testes próprios e rotas independentes. O total da suíte passou de 51 para 69 testes.

## 9. Riscos residuais adicionais

- O navegador AO/OTA não equivale ao compêndio completo e não deve ser usado para codificação de pesquisa sem conferência da fonte.
- Classificações de fratura podem mudar após imagens adicionais, redução ou cirurgia.
- Algumas escalas AAST históricas foram criadas para avaliação operatória, não para graduação exclusiva por TC.
- A graduação AAST não determina manejo isoladamente.
- Textos condensados podem omitir nuances presentes nas publicações originais; o usuário deve consultar a fonte para casos limítrofes.

