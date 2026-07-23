# Arquitetura do RadRef

## Objetivos

A arquitetura atende a quatro requisitos centrais:

1. isolar regras clínicas da interface;
2. permitir execução e teste sem servidor ou simulador;
3. manter toda cópia clínica traduzível fora dos componentes;
4. permitir inclusão de novos módulos sem reestruturar os existentes.

## Camadas

### 1. Rotas — `app/`

O Expo Router transforma os arquivos em rotas. Os arquivos de rota são intencionalmente mínimos e apenas reexportam a tela correspondente. Exemplo:

```tsx
export { FleischnerScreen as default } from '../../src/modules/lung/screens/FleischnerScreen';
```

Isso evita colocar regra clínica ou estado de formulário na infraestrutura de navegação.

### 2. Interface compartilhada — `src/components/`

Os componentes reutilizáveis incluem:

- `Screen`: rolagem com cabeçalho nativo da pilha (large title no iOS), teclado e área segura;
- `Section`: lista agrupada estilo iOS (inset grouped) com cabeçalho, separadores e rodapé;
- `ChoiceRow` (segmentado, chips ou lista com marca de seleção), `SwitchRow` e `InputRow`: entradas consistentes;
- `ResultCard`: representação comum de resultado, notas e alertas com cor de severidade;
- `Banner` e `Disclaimer`: contexto e segurança;
- `ModuleCard` e `NavRow`: navegação dirigida pelo registro;
- `ReferenceList` e `KeyPointList`: conteúdo de referência;
- `Icon`: SF Symbols no iOS (via `expo-symbols`) com glifo de texto nas demais plataformas;
- o tema em `src/theme.ts` segue o esquema claro/escuro do sistema.

Esses componentes recebem chaves de tradução, não texto clínico literal.

### 3. Domínio clínico — `src/modules/*/domain/`

Cada módulo contém tipos, funções puras e testes. As funções:

- recebem objetos de entrada tipados;
- validam intervalos e compatibilidade do contexto;
- aplicam as regras determinísticas;
- retornam códigos, severidade e referências de mensagens;
- não conhecem React, Expo, navegação ou idioma.

Contratos compartilhados ficam em `src/core/domain.ts`.

### 4. Telas de módulo — `src/modules/*/screens/`

As telas mantêm apenas:

- estado local do formulário;
- conversão de entrada localizada;
- chamada à função de domínio;
- resolução das referências de mensagens pelo provider i18n;
- composição dos componentes compartilhados.

Não existe duplicação das regras clínicas nos componentes.

### 5. Internacionalização — `src/core/i18n/`

O `I18nProvider`:

- detecta português ou inglês pelo dispositivo;
- usa inglês como fallback;
- persiste a escolha com AsyncStorage;
- fornece `t(key, params)` para chaves diretas;
- fornece `tx(messageRef)` para resultados do domínio.

Os dicionários são planos para simplificar auditoria, comparação de chaves e atualização clínica.

### 6. Registro modular — `src/core/moduleRegistry.ts`

A home e as páginas de cada seção consomem definições declarativas:

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

A adição de um módulo não exige alterar a lógica dos módulos existentes.

## Fluxo de dados

```text
entrada do usuário
      ↓
parser numérico localizado
      ↓
objeto de domínio tipado
      ↓
função clínica pura
      ↓
ClinicalResult / MessageRef
      ↓
I18nProvider
      ↓
ResultCard e notas clínicas
```

## Estratégia de testes

Os testes usam o runner nativo do Node e a remoção experimental de tipos TypeScript, sem Jest, Babel ou runtime React Native. Isso reduz a superfície de dependências e permite testar o núcleo mesmo quando o Expo não está instalado.

Cobertura principal:

- limiares exatos e arredondamento;
- combinações de morfologia e contexto;
- guardrails de aplicabilidade e estudo incompleto;
- vetores de regressão do Brock;
- conversão diâmetro/volume e crescimento;
- separação classificação/manejo;
- paridade de chaves EN/PT;
- existência de todas as chaves referenciadas;
- ausência de texto literal visível em componentes.

## TypeScript estrito

As configurações ativam:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- imports JSON tipados;
- rotas tipadas do Expo Router.

Há um `tsconfig.domain.json` independente para validar o domínio sem carregar tipos de React Native.

## Dependências e operação local

O RadRef usa Expo managed workflow porque não há requisito nativo específico que justifique o bare workflow. A preferência de idioma é o único estado persistente. As referências externas usam `Linking`; todos os cálculos permanecem locais.

## Evolução de uma diretriz

Uma atualização de guideline deve seguir este fluxo:

1. registrar a versão e as fontes primárias;
2. criar novos vetores de teste para mudanças e limites;
3. modificar somente a função de domínio afetada;
4. atualizar as chaves clínicas nos dois idiomas;
5. revisar telas apenas quando houver novos campos necessários;
6. executar validação completa e documentar diferenças de versão.

Essa ordem evita alterar a interface antes de fixar o comportamento esperado.
