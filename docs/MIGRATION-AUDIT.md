# Auditoria dos projetos Swift e plano de migração

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

Foram criados seis motores independentes:

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
