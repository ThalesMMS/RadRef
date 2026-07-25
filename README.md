# RadRef

Aplicativo modular de referência em radiologia, reconstruído em **React Native + TypeScript + Expo** a partir dos projetos SwiftUI `Lung-Nodule-dev` e `Bosniak-Renal-Cyst-dev`.

A versão 1.0 inclui dois módulos totalmente locais:

- **Nódulos pulmonares**: Fleischner Society 2017, ACR Lung-RADS v2022 e modelo Brock/PanCan completo.
- **Lesões císticas renais**: Bosniak v2019, calculadora auxiliar de realce em TC/RM e referência de manejo CUA 2023.

> **Uso educacional e de referência.** O RadRef não substitui revisão das imagens, julgamento clínico, discussão multidisciplinar, política institucional ou consulta às publicações originais. Não use o aplicativo como única base para diagnóstico, vigilância, biópsia ou tratamento.

## Stack técnico

- Expo SDK 57 (`expo ~57.0.7`) e React Native 0.86.
- React 19.2.3 e TypeScript 6.0.3.
- Expo Router com rotas tipadas.
- Persistência local da preferência de idioma com AsyncStorage.
- Nenhum módulo nativo personalizado; por isso, o fluxo gerenciado do Expo é suficiente para esta versão.

## Estado da entrega

O repositório contém a implementação completa do aplicativo: rotas, telas, componentes, regras clínicas, traduções em inglês e português, recursos gráficos, testes e documentação. Não há backend, conta de usuário, banco de dados clínico nem dependência de conexão para cálculos ou classificações.

A instalação limpa das dependências e a abertura do runtime Expo não puderam ser executadas no ambiente de construção porque o registro npm estava indisponível (`503` no gateway e falha DNS no registro público). A validação independente do domínio, dos testes e da internacionalização foi executada localmente; consulte [Validação](#validação) e [`docs/VALIDATION.md`](docs/VALIDATION.md).

## Requisitos

- Node.js **22.13 ou superior**, em conformidade com o requisito mínimo do Expo SDK 57 e com o executor de testes TypeScript sem transpilação intermediária.
- npm recente.
- Para iOS nativo: macOS com Xcode e um simulador/runtime compatível.
- Para Android nativo: Android Studio e SDK configurados, ou um dispositivo com Expo Go compatível.

## Instalação e execução

```bash
cd RadRef
npm install
npm start
```

Na interface do Expo, abra o aplicativo no Expo Go ou selecione um simulador. Também estão disponíveis:

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

## Testes

```bash
npm test
```

Modo de observação:

```bash
npm run test:watch
```

Validação agregada do domínio e das traduções:

```bash
npm run validate
```

Esse comando executa:

1. 51 testes TypeScript das regras, cálculos, limites e dicionários.
2. type-check estrito do domínio, sem dependência do React Native.
3. auditoria estática contra texto literal visível em `src/**/*.tsx`.

## Funcionalidades

### Tela inicial e navegação

- Registro central dos módulos disponíveis.
- Navegação baseada em arquivos com Expo Router.
- Tela de erro para rotas não registradas.
- Identidade visual única para todos os módulos, com tema claro e escuro seguindo o sistema.
- Navegação nativa da plataforma: cabeçalhos da pilha nativa, listas agrupadas e SF Symbols no iOS.
- Seletor **PT/EN** visível no cabeçalho de todas as telas.
- Persistência local do idioma selecionado.

### Nódulos pulmonares

- **Fleischner 2017** para nódulos sólidos, vidro fosco e parcialmente sólidos; únicos ou múltiplos; baixo ou alto risco.
- Arredondamento da medida para o milímetro inteiro mais próximo antes da aplicação dos limiares.
- **Lung-RADS v2022** com contexto do exame, estado do nódulo, diâmetro ou volume, componente sólido, crescimento, morfologia juxtapleural, nódulo de via aérea, cisto pulmonar atípico, categoria 4X e modificador S.
- Conversão local entre volume e diâmetro esférico equivalente.
- Auxílio para crescimento Lung-RADS usando aumento superior a 1,5 mm em até 12 meses.
- **Brock/PanCan full model** com os coeficientes publicados e validação dos intervalos implementados.
- Referências e pontos críticos de aplicação.

### Lesões císticas renais

- **Bosniak v2019** para TC e RM, incluindo aplicabilidade, aquisição, conteúdo, parede, septos, calcificação e protrusões realçantes.
- Guardrails para massa não predominantemente cística, etiologia alternativa, síndrome hereditária, ultrassom isolado, estudo sem contraste, calcificação que pode ocultar realce e massa heterogênea não realçante em TC.
- Sugestão de frase estruturada para o laudo, com compartilhamento pelo recurso nativo do sistema.
- Resultado de classificação separado da recomendação de manejo.
- Calculadora de realce: TC e RM, com opção de realce visual inequívoco.
- Manejo de referência **CUA 2023** por classe, tamanho, sintomas, comorbidade/expectativa de vida e alvo sólido para biópsia.
- Referências e alertas técnicos.

## Internacionalização

Todo conteúdo clínico e toda interface traduzível usam os dicionários:

```text
src/core/i18n/locales/en.json
src/core/i18n/locales/pt.json
```

Os dois arquivos possuem paridade exata de **611 chaves**. O idioma inicial segue o dispositivo quando possível e a escolha do usuário é persistida com AsyncStorage.

Para auditar textos literais em componentes:

```bash
npm run audit:i18n
```

Valores técnicos universais — por exemplo `HU`, `mm`, códigos Bosniak e categorias Lung-RADS — permanecem como dados ou unidades, não como texto clínico embutido.

## Arquitetura

```text
RadRef/
├── app/                         # Rotas Expo Router
├── assets/                      # Ícone, adaptive icon, splash e favicon
├── docs/                        # Auditoria, arquitetura, fontes e validação
├── scripts/                     # Executor de testes e auditoria i18n
└── src/
    ├── components/              # Componentes reutilizáveis de interface
    ├── content/                 # Metadados e links de referências
    ├── core/
    │   ├── i18n/                # Provider, dicionários e testes de tradução
    │   ├── domain.ts            # Contratos de mensagens/resultados clínicos
    │   ├── moduleRegistry.ts    # Registro declarativo dos módulos
    │   └── numbers.ts           # Parsing e arredondamento comuns
    ├── modules/
    │   ├── lung/
    │   │   ├── domain/          # Regras puras e testes pulmonares
    │   │   └── screens/         # Telas do módulo pulmonar
    │   └── renal/
    │       ├── domain/          # Regras puras e testes renais
    │       └── screens/         # Telas do módulo renal
    ├── screens/                 # Home, About e Not Found
    └── theme.ts                 # Tokens visuais compartilhados
```

As funções de domínio são puras, não importam React, React Native, Expo ou tradução. Elas retornam códigos e referências de mensagens; a camada de interface resolve o idioma e renderiza o resultado. Esse desenho permite testar as regras sem simulador e atualizar uma diretriz sem acoplar sua lógica aos componentes.

Detalhes: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Como acrescentar um novo módulo

1. Crie `src/modules/<id>/domain` com tipos, funções puras e testes.
2. Crie `src/modules/<id>/screens` usando os componentes compartilhados.
3. Registre o módulo e suas ferramentas em `src/core/moduleRegistry.ts`.
4. Adicione as rotas correspondentes em `app/<id>/`.
5. Inclua todas as novas chaves nos dois dicionários.
6. Execute `npm run validate` e `npm run typecheck`.

O registro central faz a tela inicial reconhecer o módulo sem alterar os motores clínicos já existentes.

## Versões das fontes clínicas

- Fleischner Society: recomendações para nódulos pulmonares incidentais, **2017**.
- ACR Lung-RADS: categorias e manejo, **versão 2022**.
- Brock/PanCan: modelo completo publicado por McWilliams et al., **2013**.
- Bosniak Classification of Cystic Renal Masses: **versão 2019**.
- Canadian Urological Association: manejo de lesões renais císticas, atualização **2023**.

Referências bibliográficas e links oficiais: [`docs/CLINICAL-SOURCES.md`](docs/CLINICAL-SOURCES.md).

## Decisões de migração e divergências encontradas

A reconstrução não é uma tradução mecânica de Swift para JavaScript. A auditoria identificou e corrigiu pontos em que a implementação Swift ou sua documentação não correspondia integralmente à fonte declarada, principalmente:

- remoção dos percentuais históricos de malignidade do Lung-RADS, pois a versão 2022 retirou essa coluna;
- reconstrução das regras de cisto pulmonar atípico da versão 2022;
- correção da recomendação Fleischner para nódulo sólido único maior que 8 mm;
- uso de `<10 mm`, e não `≤10 mm`, para o critério benigno juxtapleural do Lung-RADS;
- separação explícita entre categoria 4X e modificador S;
- registro da divergência entre a documentação renal, que declarava 43 testes, e a suíte Swift efetivamente executada, que contém 45 testes.

Auditoria completa: [`docs/MIGRATION-AUDIT.md`](docs/MIGRATION-AUDIT.md).

## Suposições documentadas

- O Lung-RADS v2022 usa linguagem discricionária para nódulo sólido ou parcialmente sólido de crescimento lento. O RadRef adota operacionalmente **4B**, de forma conservadora, e mostra uma nota de contexto.
- As faixas `<5%`, `5% a <65%` e `≥65%` do Brock são apresentadas como faixas operacionais usadas em alguns caminhos de manejo, não como categorias intrínsecas do modelo original.
- Combinações Bosniak não padronizadas não são forçadas para uma classe: o aplicativo solicita caracterização adicional ou revisão manual.

## Funcionalidades não migradas literalmente

- O visual SwiftUI original foi substituído por uma interface React Native coerente entre módulos, que reproduz os padrões nativos da plataforma (listas agrupadas, controles segmentados, cabeçalhos nativos).
- O visualizador de PDF específico de iOS não foi portado. O RadRef abre links oficiais externos e não redistribui PDFs protegidos.
- Elementos de navegação, compartilhamento e controles específicos do sistema Apple foram reconstruídos com equivalentes multiplataforma quando relevantes.
- Não foram incluídas ingestão DICOM, segmentação, detecção automática, armazenamento de dados de pacientes ou integração com servidor; esses recursos também não faziam parte do núcleo calculador solicitado.

## Privacidade e operação offline

- Cálculos, classificações e traduções funcionam localmente.
- O aplicativo não solicita identificação do paciente e não transmite dados clínicos.
- A única funcionalidade que requer internet é a abertura voluntária de um link bibliográfico externo.

## Licença

MIT. Consulte [`LICENSE`](LICENSE).
