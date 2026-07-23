# Validação executada

Data: 23 de julho de 2026.

## RadRef — domínio TypeScript

Comando:

```bash
npm run validate
```

Resultado:

```text
51 testes
51 aprovados
0 falhas
```

O comando também concluiu sem erros:

- `tsc --noEmit -p tsconfig.domain.json`;
- auditoria de texto literal traduzível em `src/**/*.tsx`;
- paridade e cobertura das chaves de internacionalização.

## Distribuição funcional dos testes

- Internacionalização: 2.
- Parsing numérico e arredondamento: 2.
- Registro modular e rotas: 2.
- Brock: 6.
- Fleischner: 6.
- Lung-RADS: 14.
- Bosniak v2019: 10.
- Realce TC/RM: 4.
- Manejo CUA 2023: 5.

A soma dos grupos corresponde à saída TAP de 51 casos.

## Verificação estática da interface

Os arquivos TypeScript/TSX foram verificados em modo estrito com declarações locais mínimas para as APIs externas. A checagem final passou sem erros e cobriu também navegação parametrizada Lung-RADS → Brock, compartilhamento nativo e os novos controles de redefinição. Em rodadas anteriores, essa checagem encontrou e levou à correção de propriedades opcionais incompatíveis com `exactOptionalPropertyTypes` e de um callback de abertura de link.

No contêiner, a checagem estática independente usou o compilador TypeScript 5.8.3 disponível globalmente. O manifesto do aplicativo fixa TypeScript `~6.0.3`, versão esperada pelo Expo SDK 57; como o pacote não pôde ser baixado, a compilação com esse binário específico e com os tipos reais do Expo não foi executada.

A verificação completa com os tipos reais do Expo deve ser repetida após `npm install`:

```bash
npm run typecheck
npm run doctor
npx expo install --check
```

## Revisão do manifesto Expo

As versões declaradas em `package.json` foram alinhadas às recomendações publicadas para o Expo SDK 57 em 23 de julho de 2026, incluindo Expo, Expo Router, Constants, Linking, Localization, SplashScreen, StatusBar, SystemUI, React Native, React Native Web, Safe Area Context, Screens e TypeScript. O requisito de Node foi definido como `>=22.13.0`. Essa revisão do manifesto reduz incompatibilidades conhecidas, mas não substitui `npm install`, `npx expo install --check` e `expo-doctor`.

## Projeto Swift renal original

Comando executado no ZIP fornecido:

```bash
swift test
```

Resultado observado:

```text
Executed 45 tests, with 0 failures (0 unexpected)
```

Esse resultado confirma a divergência com dois arquivos de notas que ainda declaravam 43 testes.

## Projeto Swift pulmonar original

O projeto pulmonar é um target Xcode/iOS e não expõe um Swift Package independente. O ambiente de construção não possuía Xcode nem runtime de iOS; portanto, a suíte XCTest original não pôde ser executada ali. Os arquivos-fonte, testes e tabelas de casos foram inspecionados, e os comportamentos principais foram reconstruídos em testes TypeScript independentes.

## Limitação de rede do ambiente

Durante a validação, a instalação npm falhou por indisponibilidade externa:

- gateway interno do registro: HTTP 503;
- tentativa de registro público: falha de resolução DNS `EAI_AGAIN`.

Por essa razão, não houve boot real do Metro/Expo nem execução em simulador no contêiner. O projeto inclui configuração e versões de dependência; a validação final de runtime deve ser feita em ambiente com acesso ao registro npm.

## O que os testes não demonstram

- segurança clínica;
- eficácia diagnóstica;
- equivalência regulatória;
- adequação a todos os contextos ou políticas locais;
- correção de medidas inseridas pelo usuário;
- desempenho em dispositivo real.

Os testes demonstram consistência determinística com as regras e suposições codificadas.
