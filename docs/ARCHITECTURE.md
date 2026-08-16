# RadRef architecture

## Goals

The architecture addresses six core requirements:

1. isolate clinical rules from the interface;
2. support execution and testing without a server or simulator;
3. keep all translatable clinical copy outside components;
4. add modules without restructuring existing ones;
5. represent extensive classifications as typed, auditable data;
6. preserve local operation without storing patient data.

## Layers

### 1. Routes — `app/`

Expo Router turns files into routes. Route files are minimal and re-export the corresponding screen:

```tsx
export { SolidOrganScreen as default } from '../../src/modules/trauma/screens/SolidOrganScreen';
```

The test suite verifies routes against `moduleRegistry.ts`.

### 2. Shared interface — `src/components/`

Reusable components include:

- `Screen`: scrolling, keyboard handling, safe area, and native header; it also accepts a `switcher`, which scrolls with the lede, and a `result`, which remains fixed below the navigation bar while the form scrolls underneath;
- `Section`: field and list grouping with an optional header `infoKey`;
- `ChoiceRow`, `SwitchRow`, and `InputRow`: consistent inputs; `ChoiceRow` chooses among a segmented control, chips, a compact picker row (`menu`), and an expanded list;
- `ResultCard`: code, result, severity meter, notes, and warnings; the `hero` variant collapses notes and metadata behind a disclosure so it can remain fixed at the top;
- `Sheet` and `InfoButton`: a reusable bottom sheet for pickers and the inline information button that opens definitions and criteria;
- `ToolSwitcher`: switches among sibling tools in a module using data from `moduleRegistry.ts`;
- `Banner` and `Disclaimer`: context, scope, and safety;
- `ModuleCard` and `NavRow`: registry-driven navigation;
- `ReferenceList` and `KeyPointList`: reference content;
- `Icon`: SF Symbols on iOS with a text fallback on other platforms;
- theme tokens in `src/theme.ts` for light/dark appearance, module accents, and the severity-meter scale.

Components receive translation keys or `MessageRef` values, never embedded clinical text.

### 3. Clinical domain — `src/modules/*/domain/`

Each module contains types, pure functions, and tests. The functions:

- receive typed objects;
- validate ranges, hierarchies, and contextual compatibility;
- apply deterministic rules;
- return a `ClinicalResult`, code, and `MessageRef`;
- do not import React, React Native, Expo, navigation, or language state.

Shared contracts live in `src/core/domain.ts`.

The five modules use two complementary strategies:

#### Decision engines

Used for Fleischner, Lung-RADS, Brock, Bosniak, enhancement, management, LI-RADS, liver treatment response, and AAST solid organs. Explicit rules evaluate the input and produce a clinical result.

#### Hierarchical clinical registries

Used for AO/OTA and the AAST scales. Typed arrays and maps represent the structure, making it possible to:

- filter by region;
- navigate among type, group, and subgroup;
- assemble codes without duplicating logic in each screen;
- test uniqueness, coverage, and parent-child relationships;
- verify every dynamically generated translation key.

### 4. Module screens — `src/modules/*/screens/`

Screens contain only:

- local form state;
- locale-aware parsing;
- selection of clinical-registry items;
- calls to domain functions;
- composition of shared components.

Clinical rules are not reimplemented in JSX.

### 5. Internationalization — `src/core/i18n/`

`I18nProvider`:

- detects Portuguese or English from the device;
- uses English as the fallback;
- persists the selection with AsyncStorage;
- provides `t(key, params)` for direct keys;
- provides `tx(messageRef)` for domain results.

The dictionaries are flat. The suite validates:

- exact EN/PT parity;
- nonempty values;
- static keys used by screens;
- dynamically constructed keys for AO/OTA, OTA-OFC, PCCF, UCPF, and AAST;
- absence of literal translatable text in components.

### 6. Module registry — `src/core/moduleRegistry.ts`

The home screen and module pages consume declarative definitions:

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

Registered modules:

- `lung`;
- `renal`;
- `liver`;
- `fracture`;
- `trauma`.

Adding a module does not require changing existing engines.

### 7. References — `src/content/references.ts`

Bibliographic metadata and links are kept separate from screens. Third-party PDFs, tables, and illustrations are not packaged as application content. Screens open external sources at the user's request.

## Specialized module structure

### Liver

```text
src/modules/liver/
├── domain/
│   ├── liRads.ts                  # CT/MRI v2018 diagnosis
│   ├── treatmentResponse.ts       # v2024 treatment response
│   └── *.test.ts
└── screens/
    ├── LiverHomeScreen.tsx
    ├── LiRadsScreen.tsx
    ├── TreatmentResponseScreen.tsx
    └── LiverReferencesScreen.tsx
```

The two liver tools keep diagnosis and treatment response in separate workflows. Scope and source details are documented in `docs/LI-RADS.md`.

### Fractures

```text
src/modules/fracture/
├── domain/
│   ├── adultAoOta.ts       # adult regions, patterns, and generator
│   ├── openFracture.ts     # OTA-OFC
│   ├── pediatric.ts        # PCCF
│   ├── periprosthetic.ts   # UCPF
│   ├── dislocations.ts     # joint + direction
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

The adult registry contains 31 major regions. Each pattern stores `code`, `labelKey`, `level`, and, where applicable, `parent`. The generator validates the type → group → subgroup path before producing the code.

### Trauma

```text
src/modules/trauma/
├── domain/
│   ├── aastScales.ts       # 32 scales, regions, grades, and notes
│   ├── solidOrgan.ts       # 2018 imaging criteria
│   └── trauma.test.ts
└── screens/
    ├── TraumaHomeScreen.tsx
    ├── AastScalesScreen.tsx
    ├── AastGradeList.tsx
    ├── SolidOrganScreen.tsx
    └── TraumaReferencesScreen.tsx
```

`aastScales.ts` is a descriptive registry. `solidOrgan.ts` is a selected-criterion decision tool for the spleen, liver, and kidney.

## Data flow

```text
user input or selection
          ↓
typed parser/clinical registry
          ↓
pure domain function
          ↓
ClinicalResult / MessageRef
          ↓
I18nProvider
          ↓
ResultCard, lists, and notes
```

## Testing strategy

Tests use the native Node runner with experimental TypeScript type stripping, without Jest or Babel.

Primary coverage:

- thresholds and rounding;
- morphology and context combinations;
- applicability guardrails;
- Brock regression vectors;
- diameter/volume conversion and growth;
- separation of classification and management;
- AO/OTA hierarchy and shaft qualifiers;
- composition of OTA-OFC, PCCF, UCPF, and dislocation codes;
- presence and regional grouping of all 32 AAST scales;
- CT criteria and AIS values for the 2018 solid-organ scales;
- module registry and route existence;
- EN/PT parity and coverage.

## Strict TypeScript

The configurations enable:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- typed Expo Router routes.

`tsconfig.domain.json` validates the domain without loading React Native types. The full interface check runs through `npm run typecheck` after dependencies are installed.

## Dependencies and local operation

RadRef uses the Expo managed workflow. Language preference is the only persisted state. External references use `Linking`; classifications and calculations remain local.

## Evolving a clinical source

A source update must follow this sequence:

1. record the version and primary source;
2. compare the new version with the current registry;
3. create tests for changes and boundaries;
4. modify the domain/clinical registry;
5. update both dictionaries;
6. change screens only when new fields are required;
7. run the complete validation set;
8. document changes, coverage, and content not migrated.

This order reduces the risk of divergence among interface, translation, and clinical rules.
