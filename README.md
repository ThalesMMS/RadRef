# RadRef

Aplicativo modular de referência em radiologia, escrito em **React Native + TypeScript + Expo**. O projeto foi inicialmente reconstruído a partir dos aplicativos SwiftUI `Lung-Nodule-dev` e `Bosniak-Renal-Cyst-dev` e, na versão 1.1, passou a incluir também ferramentas de **Fraturas** e **Trauma**.

A versão 1.1 contém quatro módulos locais:

- **Nódulos pulmonares**: Fleischner Society 2017, ACR Lung-RADS v2022 e modelo Brock/PanCan completo.
- **Lesões císticas renais**: Bosniak v2019, calculadora auxiliar de realce em TC/RM e referência de manejo CUA 2023.
- **Fraturas**: navegador e geradores de código baseados no *AO/OTA Fracture and Dislocation Classification Compendium—2018*, incluindo fraturas adultas, OTA-OFC, PCCF pediátrica, UCPF e luxações.
- **Trauma**: navegador das 32 escalas de lesão AAST fornecidas, além de ferramenta específica para os critérios tomográficos de baço, fígado e rim da revisão de 2018.

> **Uso educacional e de referência.** O RadRef não substitui revisão das imagens, julgamento clínico, discussão multidisciplinar, política institucional ou consulta às publicações originais. Não use o aplicativo como única base para diagnóstico, graduação, vigilância, biópsia, intervenção ou tratamento.

## Stack técnico

- Expo SDK 57 (`expo ~57.0.7`) e React Native 0.86.
- React 19.2.3 e TypeScript 6.0.3.
- Expo Router com rotas tipadas.
- Persistência local da preferência de idioma com AsyncStorage.
- Regras clínicas determinísticas, executadas sem backend.
- Nenhum módulo nativo personalizado; o fluxo gerenciado do Expo é suficiente para esta versão.

## Estado da entrega

O repositório contém rotas, telas, componentes, regras clínicas, traduções em inglês e português, recursos gráficos, testes e documentação. Não há conta de usuário, banco de dados clínico, cadastro de pacientes ou dependência de conexão para cálculos e classificações.

A instalação integral das dependências e o boot do runtime Expo não foram repetidos no ambiente de construção porque o acesso ao registro npm ficou indisponível/intermitente. A validação independente do domínio, das rotas e da internacionalização foi executada localmente. Consulte [Validação](#validação) e [`docs/VALIDATION.md`](docs/VALIDATION.md).

## Requisitos

- Node.js **22.13 ou superior**.
- npm recente.
- Para iOS nativo: macOS com Xcode e simulador/runtime compatível.
- Para Android nativo: Android Studio e SDK configurados, ou dispositivo compatível com Expo Go.

## Instalação e execução

```bash
cd RadRef
npm install
npm start
```

Outros comandos:

```bash
npm run ios
npm run android
npm run web
```

Verificações recomendadas após a instalação:

```bash
npx expo install --check
npm run doctor
npm run typecheck
npm run validate
```

## Validação

```bash
npm run validate
```

O comando executa:

1. **69 testes TypeScript** de regras, cálculos, hierarquias, limites, rotas e dicionários.
2. Type-check estrito do domínio, sem depender do runtime React Native.
3. Auditoria de internacionalização e de texto literal traduzível em componentes.

Também estão disponíveis:

```bash
npm test
npm run test:watch
npm run typecheck:domain
npm run audit:i18n
```

## Funcionalidades

### Tela inicial e navegação

- Registro central dos quatro módulos e de suas ferramentas.
- Navegação por arquivos com Expo Router.
- Tema claro/escuro seguindo o sistema.
- Cabeçalhos nativos, listas agrupadas e SF Symbols no iOS.
- Seletor **PT/EN** visível no cabeçalho.
- Persistência local do idioma selecionado.
- Tela de erro para rotas não registradas.

### Nódulos pulmonares

- **Fleischner 2017** para nódulos sólidos, em vidro fosco e parcialmente sólidos; únicos ou múltiplos; baixo ou alto risco.
- Arredondamento para o milímetro inteiro mais próximo antes da aplicação dos limiares.
- **Lung-RADS v2022** com contexto do exame, estado do nódulo, diâmetro/volume, componente sólido, crescimento, morfologia juxtapleural, nódulo de via aérea, cisto pulmonar atípico, categoria 4X e modificador S.
- Conversão entre volume e diâmetro esférico equivalente.
- Auxílio para crescimento Lung-RADS usando aumento superior a 1,5 mm em até 12 meses.
- **Brock/PanCan full model** com coeficientes publicados e validação dos intervalos implementados.
- Referências e pontos críticos de aplicação.

### Lesões císticas renais

- **Bosniak v2019** para TC e RM, incluindo aplicabilidade, aquisição, conteúdo, parede, septos, calcificação e protrusões realçantes.
- Guardrails para massa não predominantemente cística, etiologia alternativa, síndrome hereditária, ultrassom isolado, estudo sem contraste, calcificação potencialmente limitante e massa heterogênea não realçante em TC.
- Sugestão de frase estruturada para o laudo, com compartilhamento pelo sistema.
- Classificação separada da recomendação de manejo.
- Calculadora de realce para TC e RM, com opção de realce visual inequívoco.
- Manejo de referência **CUA 2023** por classe, tamanho, sintomas, comorbidade/expectativa de vida e alvo sólido para biópsia.

### Fraturas — AO/OTA 2018

- Navegador hierárquico de fraturas adultas com **31 regiões principais** do compêndio.
- Seleção de tipo, grupo e, quando implementado, subgrupo; geração do código AO/OTA correspondente.
- Qualificação de terço proximal, médio ou distal nas regiões diafisárias compatíveis.
- Regiões incluídas: úmero, rádio, ulna, escápula, clavícula, fêmur, patela, tíbia, fíbula, segmento maleolar, anel pélvico, acetábulo, mão/carpo, pé, coluna cervical, coluna toracolombar, sacro, costelas e esterno.
- **OTA Open Fracture Classification (OTA-OFC)** com os cinco componentes independentes: pele, músculo, lesão arterial, contaminação e perda óssea.
- **AO Pediatric Comprehensive Classification of Long Bone Fractures (PCCF)** com gerador de código para úmero, rádio, ulna, fêmur, tíbia e fíbula.
- **Unified Classification System for Periprosthetic Fractures (UCPF)** com geração do modificador articular/tipo.
- Codificação de **luxações** por articulação e direção, conforme os modificadores universais do compêndio.
- Tela de referências e alertas de escopo.

O navegador adulto prioriza cobertura prática das regiões, tipos, grupos e subgrupos mais relevantes. Ele não tenta reproduzir todas as figuras, qualificações específicas, modificadores universais ou combinações raras do compêndio. O documento original permanece a referência definitiva.

### Trauma — AAST

- Navegador das **32 escalas de lesão AAST** presentes no material fornecido.
- Organização por pescoço, tórax, abdome, geniturinário, pelve/reprodutivo e extremidades.
- Critérios resumidos e parafraseados por grau, com notas específicas de multiplicidade, bilateralidade, circunferência vascular e limitações da fonte arquivada.
- Ferramenta tomográfica dedicada para **baço, fígado e rim — revisão de 2018**, com classificação pelo critério selecionado, mapeamento AIS e lembretes de protocolo multifásico.
- Separação explícita entre graduação anatômica e decisão de tratamento.

As escalas AAST mais antigas misturam critérios operatórios, anatômicos e radiológicos. O aplicativo preserva a versão identificada e não infere conteúdo ausente ou ilegível na fonte.

## Internacionalização

Todo conteúdo clínico e toda interface traduzível usam:

```text
src/core/i18n/locales/en.json
src/core/i18n/locales/pt.json
```

Os arquivos possuem paridade exata de **1.424 chaves**. O idioma inicial segue o dispositivo quando possível, e a escolha do usuário é persistida com AsyncStorage.

A suíte de testes verifica também chaves construídas dinamicamente pelos navegadores AO/OTA, PCCF, UCPF, OTA-OFC e AAST.

## Arquitetura

```text
RadRef/
├── app/                         # Rotas Expo Router
├── assets/                      # Ícone, splash e favicon
├── docs/                        # Arquitetura, fontes, auditoria e validação
├── scripts/                     # Testes e auditoria i18n
└── src/
    ├── components/              # Interface reutilizável
    ├── content/                 # Referências bibliográficas
    ├── core/
    │   ├── i18n/                # Provider, dicionários e testes
    │   ├── domain.ts            # MessageRef e ClinicalResult
    │   ├── moduleRegistry.ts    # Registro declarativo dos módulos
    │   └── numbers.ts           # Parsing e arredondamento
    ├── modules/
    │   ├── lung/                # Nódulos pulmonares
    │   ├── renal/               # Lesões císticas renais
    │   ├── fracture/            # AO/OTA, OTA-OFC, PCCF, UCPF e luxações
    │   └── trauma/              # Escalas AAST e órgãos sólidos 2018
    ├── screens/                 # Home, About e Not Found
    └── theme.ts                 # Tokens visuais compartilhados
```

As funções de domínio são puras: não importam React, React Native, Expo ou tradução. Elas retornam códigos e referências de mensagens, resolvidas pela camada de interface. Isso permite testar as regras sem simulador e atualizar um sistema de classificação sem acoplá-lo aos componentes.

Detalhes: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Como acrescentar um novo módulo

1. Crie `src/modules/<id>/domain` com tipos, funções puras e testes.
2. Crie `src/modules/<id>/screens` usando os componentes compartilhados.
3. Registre o módulo e suas ferramentas em `src/core/moduleRegistry.ts`.
4. Adicione as rotas em `app/<id>/`.
5. Inclua todas as novas chaves nos dois dicionários.
6. Execute `npm run validate` e `npm run typecheck`.

## Versões das fontes clínicas

- Fleischner Society: **2017**.
- ACR Lung-RADS: **2022**.
- Brock/PanCan: **2013**.
- Bosniak Classification of Cystic Renal Masses: **2019**.
- Canadian Urological Association: **2023**.
- AO/OTA Fracture and Dislocation Classification Compendium: **2018**.
- AAST spleen, liver and kidney Organ Injury Scale: revisão **2018**.
- Demais escalas AAST: versões históricas identificadas no material arquivado fornecido.

Referências e notas de uso: [`docs/CLINICAL-SOURCES.md`](docs/CLINICAL-SOURCES.md).

## Decisões de migração e expansão

A reconstrução não é uma tradução mecânica de Swift para JavaScript. As regras pulmonares e renais foram reconstruídas a partir do comportamento dos projetos Swift; os módulos de Fraturas e Trauma foram modelados como estruturas de dados clínicas independentes, com conteúdo resumido/parafraseado e sem redistribuição de figuras ou tabelas protegidas.

Principais decisões:

- manter classificação e manejo separados;
- não forçar categorias em combinações não padronizadas;
- preservar códigos oficiais, mas não reproduzir integralmente páginas, desenhos ou tabelas das publicações;
- marcar explicitamente cobertura parcial no navegador AO/OTA adulto;
- não inventar graus ausentes na cópia arquivada das escalas AAST;
- tratar a ferramenta de órgãos sólidos como graduação por imagem, não como algoritmo terapêutico.

Auditoria completa: [`docs/MIGRATION-AUDIT.md`](docs/MIGRATION-AUDIT.md).

## Privacidade e operação offline

- Cálculos, classificações e traduções funcionam localmente.
- O aplicativo não solicita identificação do paciente.
- Nenhum dado clínico é transmitido.
- Apenas a abertura voluntária de links bibliográficos requer internet.

## Direitos sobre as fontes

O código do RadRef é distribuído sob MIT. As publicações, tabelas e figuras clínicas permanecem sob os direitos de seus respectivos autores, sociedades e editoras. O aplicativo usa descrições resumidas/parafraseadas e links para as fontes; uso comercial ou reprodução integral do material de referência pode exigir autorização específica.

## Licença

MIT. Consulte [`LICENSE`](LICENSE).
