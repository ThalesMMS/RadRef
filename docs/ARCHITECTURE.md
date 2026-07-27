# Arquitetura do RadRef

## Objetivos

A arquitetura atende a seis requisitos centrais:

1. isolar regras clínicas da interface;
2. permitir execução e teste sem servidor ou simulador;
3. manter toda cópia clínica traduzível fora dos componentes;
4. incluir novos módulos sem reestruturar os existentes;
5. representar classificações extensas como dados tipados e auditáveis;
6. preservar operação local, sem armazenamento de dados de pacientes.

## Camadas

### 1. Rotas — `app/`

O Expo Router transforma arquivos em rotas. Os arquivos são mínimos e reexportam a tela correspondente:

```tsx
export { SolidOrganScreen as default } from '../../src/modules/trauma/screens/SolidOrganScreen';
```

As rotas são verificadas contra `moduleRegistry.ts` pela suíte de testes.

### 2. Interface compartilhada — `src/components/`

Os componentes reutilizáveis incluem:

- `Screen`: rolagem, teclado, área segura e cabeçalho nativo; recebe ainda `switcher` (rola junto com a lede) e `result`, fixado abaixo da barra de navegação enquanto o formulário rola por baixo;
- `Section`: agrupamento de campos e listas, com `infoKey` opcional no cabeçalho;
- `ChoiceRow`, `SwitchRow` e `InputRow`: entradas consistentes; `ChoiceRow` resolve entre controle segmentado, chips, linha compacta com seletor (`menu`) e lista aberta;
- `ResultCard`: código, resultado, medidor de severidade, notas e alertas; a variante `hero` recolhe notas e metadados atrás de um disclosure para caber fixada no topo;
- `Sheet` e `InfoButton`: folha inferior reutilizada pelos seletores e pelo (i) inline que abre definições e critérios;
- `ToolSwitcher`: alternância entre as ferramentas irmãs de um módulo, lida de `moduleRegistry.ts`;
- `Banner` e `Disclaimer`: contexto, escopo e segurança;
- `ModuleCard` e `NavRow`: navegação dirigida pelo registro;
- `ReferenceList` e `KeyPointList`: conteúdo de referência;
- `Icon`: SF Symbols no iOS e fallback textual nas demais plataformas;
- tokens de tema em `src/theme.ts` para claro/escuro, acentos por módulo e a escala de severidade do medidor.

Os componentes recebem chaves de tradução ou `MessageRef`, nunca texto clínico embutido.

### 3. Domínio clínico — `src/modules/*/domain/`

Cada módulo contém tipos, funções puras e testes. As funções:

- recebem objetos tipados;
- validam intervalos, hierarquias e compatibilidade de contexto;
- aplicam regras determinísticas;
- retornam `ClinicalResult`, código e `MessageRef`;
- não importam React, React Native, Expo, navegação ou idioma.

Contratos compartilhados ficam em `src/core/domain.ts`.

Os quatro módulos usam duas estratégias complementares:

#### Motores de decisão

Usados em Fleischner, Lung-RADS, Brock, Bosniak, realce, manejo e órgãos sólidos AAST. A entrada é avaliada por regras explícitas e produz um resultado clínico.

#### Registros clínicos hierárquicos

Usados em AO/OTA e nas escalas AAST. A estrutura é representada por arrays e mapas tipados, permitindo:

- filtrar por região;
- navegar entre tipo, grupo e subgrupo;
- montar códigos sem duplicar lógica em cada tela;
- testar unicidade, cobertura e relações pai-filho;
- verificar todas as chaves de tradução geradas dinamicamente.

### 4. Telas de módulo — `src/modules/*/screens/`

As telas mantêm somente:

- estado local do formulário;
- parsing localizado;
- seleção de itens do registro clínico;
- chamada à função de domínio;
- composição dos componentes compartilhados.

A regra clínica não é reimplementada em JSX.

### 5. Internacionalização — `src/core/i18n/`

O `I18nProvider`:

- detecta português ou inglês pelo dispositivo;
- usa inglês como fallback;
- persiste a escolha com AsyncStorage;
- fornece `t(key, params)` para chaves diretas;
- fornece `tx(messageRef)` para resultados do domínio.

Os dicionários são planos. A suíte valida:

- paridade exata EN/PT;
- valores não vazios;
- chaves estáticas em telas;
- chaves construídas dinamicamente em AO/OTA, OTA-OFC, PCCF, UCPF e AAST;
- ausência de texto traduzível literal em componentes.

### 6. Registro modular — `src/core/moduleRegistry.ts`

A home e as páginas de cada módulo consomem definições declarativas:

```ts
{
  id,
  titleKey,
  descriptionKey,
  route,
  guidelineKey,
  accent,
  tools
}
```

Módulos registrados:

- `lung`;
- `renal`;
- `fracture`;
- `trauma`.

A adição de um módulo não exige alterar os motores existentes.

### 7. Referências — `src/content/references.ts`

Os metadados bibliográficos e links ficam separados das telas. PDFs e tabelas protegidas não são empacotados como conteúdo do aplicativo. As telas abrem as fontes externas quando o usuário solicita.

## Estrutura dos módulos novos

### Fraturas

```text
src/modules/fracture/
├── domain/
│   ├── adultAoOta.ts       # regiões, padrões e gerador adulto
│   ├── openFracture.ts     # OTA-OFC
│   ├── pediatric.ts        # PCCF
│   ├── periprosthetic.ts   # UCPF
│   ├── dislocations.ts     # articulação + direção
│   └── fracture.test.ts
└── screens/
    ├── FractureHomeScreen.tsx
    ├── AdultFractureScreen.tsx
    ├── OpenFractureScreen.tsx
    ├── PediatricFractureScreen.tsx
    ├── PeriprostheticScreen.tsx
    ├── DislocationsScreen.tsx
    └── FractureReferencesScreen.tsx
```

O registro adulto contém 31 regiões principais. Cada padrão armazena `code`, `labelKey`, `level` e, quando aplicável, `parent`. O gerador valida a trajetória tipo → grupo → subgrupo antes de produzir o código.

### Trauma

```text
src/modules/trauma/
├── domain/
│   ├── aastScales.ts       # 32 escalas, regiões, graus e notas
│   ├── solidOrgan.ts       # critérios de imagem 2018
│   └── trauma.test.ts
└── screens/
    ├── TraumaHomeScreen.tsx
    ├── AastScalesScreen.tsx
    ├── AastGradeList.tsx
    ├── SolidOrganScreen.tsx
    └── TraumaReferencesScreen.tsx
```

`aastScales.ts` é um registro descritivo. `solidOrgan.ts` é uma ferramenta de decisão por critério selecionado para baço, fígado e rim.

## Fluxo de dados

```text
entrada ou seleção do usuário
             ↓
parser/registro clínico tipado
             ↓
função de domínio pura
             ↓
ClinicalResult / MessageRef
             ↓
I18nProvider
             ↓
ResultCard, listas e notas
```

## Estratégia de testes

Os testes usam o runner nativo do Node com remoção experimental de tipos TypeScript, sem Jest ou Babel.

Cobertura principal:

- limiares e arredondamento;
- combinações de morfologia e contexto;
- guardrails de aplicabilidade;
- vetores de regressão do Brock;
- conversão diâmetro/volume e crescimento;
- separação classificação/manejo;
- hierarquia AO/OTA e qualificadores diafisários;
- composição dos códigos OTA-OFC, PCCF, UCPF e luxação;
- presença das 32 escalas AAST e agrupamento regional;
- critérios tomográficos e AIS dos órgãos sólidos 2018;
- registro modular e existência das rotas;
- paridade e cobertura EN/PT.

## TypeScript estrito

As configurações ativam:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- rotas tipadas do Expo Router.

`tsconfig.domain.json` valida o domínio sem carregar tipos de React Native. A checagem completa de interface usa `npm run typecheck` após a instalação das dependências.

## Dependências e operação local

O RadRef usa Expo managed workflow. A preferência de idioma é o único estado persistente. As referências externas usam `Linking`; classificações e cálculos permanecem locais.

## Evolução de uma fonte clínica

Uma atualização deve seguir:

1. registrar versão e fonte primária;
2. comparar a nova versão com o registro atual;
3. criar testes para alterações e limites;
4. modificar domínio/registro clínico;
5. atualizar os dois dicionários;
6. revisar telas somente quando novos campos forem necessários;
7. executar validação completa;
8. documentar mudanças, cobertura e conteúdo não migrado.

Essa ordem reduz risco de divergência entre interface, tradução e regra clínica.
