# Validação executada

Data: **25 de julho de 2026**.

## RadRef — domínio TypeScript

Comando:

```bash
npm run validate
```

Resultado:

```text
69 testes
69 aprovados
0 falhas
```

O comando também concluiu sem erros:

- `tsc --noEmit -p tsconfig.domain.json`;
- auditoria de texto literal traduzível em `src/**/*.tsx`;
- paridade exata dos dicionários EN/PT;
- cobertura de chaves estáticas e dinâmicas de internacionalização.

## Distribuição dos testes

| Área | Testes |
|---|---:|
| Internacionalização | 2 |
| Registro modular e rotas | 2 |
| Parsing numérico e arredondamento | 2 |
| Fraturas AO/OTA, OTA-OFC, PCCF, UCPF e luxações | 11 |
| Brock/PanCan | 6 |
| Fleischner | 6 |
| Lung-RADS | 13 |
| Bosniak v2019 | 11 |
| Realce em TC/RM | 4 |
| Manejo CUA 2023 | 5 |
| Trauma AAST | 7 |
| **Total** | **69** |

## Cobertura específica dos módulos novos

### Fraturas

A suíte verifica:

- presença das 31 regiões adultas principais cadastradas;
- hierarquia tipo → grupo → subgrupo;
- rejeição de trajetória pai-filho inválida;
- uso de qualificador de terço apenas em regiões diafisárias;
- composição do perfil OTA-OFC de cinco componentes;
- destaque de lesão arterial com isquemia;
- código PCCF em sistemas de ossos pareados;
- rejeição de segmento/subsegmento pediátrico incompatível;
- composição do modificador UCPF;
- código de luxação por articulação e direção;
- lookup determinístico das regiões adultas.

### Trauma

A suíte verifica:

- presença das 32 escalas AAST do material arquivado;
- agrupamento de todas as escalas em seis regiões;
- mapeamento AIS das revisões 2018 de baço, fígado e rim;
- progressão monotônica da severidade visual por grau;
- unicidade dos critérios tomográficos de órgãos sólidos;
- cobertura de baço, fígado e rim;
- rejeição de critério pertencente a outro órgão.

## Internacionalização

Os dicionários inglês e português possuem **1.424 chaves** cada, com paridade exata.

Além das referências estáticas encontradas em telas e funções, o teste inclui explicitamente chaves construídas em runtime para:

- graus e componentes OTA-OFC;
- subsegmentos e gravidade PCCF;
- articulações UCPF;
- articulações e direções de luxação;
- critérios e graus tomográficos de órgãos sólidos;
- títulos, notas e critérios de todas as 32 escalas AAST;
- regiões, notas e padrões do navegador adulto AO/OTA.

## Verificação estática da interface

Todos os arquivos não-teste em `src/` e `app/` foram submetidos a uma checagem estrita auxiliar com declarações locais mínimas para React, React Native e Expo. Essa verificação identificou três usos de propriedades opcionais incompatíveis com `exactOptionalPropertyTypes` nas novas telas; os três foram corrigidos com propagação condicional de `warnings`.

Após completar os stubs necessários, a compilação auxiliar terminou sem erros. Esse resultado é útil para detectar problemas internos de TypeScript e JSX, mas não substitui a compilação com os tipos reais das dependências.

A verificação oficial completa deve ser repetida com as dependências instaladas:

```bash
npm install
npm run typecheck
npm run doctor
npx expo install --check
```

## Type-check do domínio

`npm run typecheck:domain` usa `tsconfig.domain.json`, com:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- resolução NodeNext;
- ausência de dependência de React Native.

Esse comando passou com o domínio completo dos quatro módulos.

## Runtime Expo

O ambiente de construção não manteve uma instalação completa de `node_modules`, e a tentativa de instalação ficou bloqueada por acesso indisponível/intermitente ao registro npm. Portanto, não houve boot do Metro, execução em Expo Go ou simulador no contêiner.

O manifesto foi atualizado para a versão **1.1.0** e mantém as dependências já definidas para Expo SDK 57. A validação final em dispositivo deve incluir os comandos de instalação e verificação acima.

## Projetos Swift originais

### Projeto renal

A execução registrada anteriormente no material-fonte foi:

```text
45 testes
45 aprovados
0 falhas
```

Isso confirma a divergência com notas antigas que ainda declaravam 43 testes.

### Projeto pulmonar

O projeto pulmonar é um target Xcode/iOS e não expõe Swift Package independente. O ambiente de construção não possuía runtime Xcode; seus arquivos-fonte, testes e casos-limite foram inspecionados e reconstruídos na suíte TypeScript.

## O que os testes não demonstram

- segurança clínica ou eficácia diagnóstica;
- equivalência regulatória;
- completude integral do compêndio AO/OTA;
- adequação a todos os mecanismos de trauma ou políticas locais;
- correção das medidas e seleções feitas pelo usuário;
- desempenho ou layout em todos os dispositivos;
- recomendação de tratamento baseada somente no grau AAST.

Os testes demonstram consistência determinística com as regras, registros e suposições codificados.
