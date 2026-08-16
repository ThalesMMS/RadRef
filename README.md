# RadRef

A modular radiology reference application built with **React Native + TypeScript + Expo**. Clinical rules run locally, without a backend or patient-data storage.

The current version contains five modules:

- **Pulmonary nodules**: Fleischner Society 2017, ACR Lung-RADS v2022, and the complete Brock/PanCan model.
- **Cystic renal lesions**: Bosniak v2019, an auxiliary CT/MRI enhancement calculator, and CUA 2023 management guidance.
- **Liver**: LI-RADS CT/MRI v2018 and Treatment Response Assessment v2024 for locoregional therapies.
- **Fractures**: a text-based browser and code generators based on the *AO/OTA Fracture and Dislocation Classification Compendium—2018*, including adult fractures, OTA-OFC, pediatric PCCF, UCPF, and dislocations.
- **Trauma**: a browser for 32 AAST injury scales and a dedicated tool for the CT criteria in the 2018 spleen, liver, and kidney revision.

> **For education and reference.** RadRef does not replace image review, clinical judgment, multidisciplinary discussion, institutional policy, or consultation of the original publications. Do not use the application as the sole basis for diagnosis, grading, surveillance, biopsy, intervention, or treatment.

## Technical stack

- Expo SDK 57 (`expo ~57.0.13`) and React Native 0.86.2.
- React 19.2.3 and TypeScript 6.0.3.
- Expo Router with typed routes.
- Local language-preference persistence with AsyncStorage.
- Deterministic clinical rules executed without a backend.
- No custom native modules; the Expo managed workflow is sufficient for this version.

## Delivery status

The repository contains routes, screens, components, clinical rules, English and Portuguese translations, first-party graphics, tests, and documentation. It has no user accounts, clinical database, patient registry, or network dependency for calculations and classifications.

The standard `npm run validate` workflow runs the domain tests, the domain-only strict TypeScript check, and the internationalization audit. Dependency installation and compatibility, full TypeScript checking, Expo Doctor, and static web export are separate checks listed below. These checks do not replace independent clinical review or regulatory assessment.

## Requirements

- Node.js **22.13 or later**.
- A recent npm version.
- For native iOS: macOS with Xcode and a compatible simulator/runtime.
- For native Android: Android Studio and a configured SDK, or an Expo Go-compatible device.

## Installation and execution

```bash
cd RadRef
npm ci
npm start
```

Other commands:

```bash
npm run ios
npm run android
npm run web
```

Recommended checks after installation:

```bash
npx expo install --check
npm run doctor
npm run typecheck
npm run validate
npx expo export --platform web
```

## Validation

```bash
npm run validate
```

This command runs:

1. **97 TypeScript tests** covering rules, calculations, hierarchies, boundaries, routes, and dictionaries.
2. Strict domain type-checking without depending on the React Native runtime.
3. Internationalization and literal translatable-text audits in components.

The following commands are also available:

```bash
npm test
npm run test:watch
npm run typecheck
npm run typecheck:domain
npm run audit:i18n
```

## Features

### Home screen and navigation

- Central registry for the five modules and their tools.
- File-based navigation with Expo Router.
- System-aware light and dark themes.
- Native headers, grouped lists, and SF Symbols on iOS.
- A **PT/EN** selector visible in the header.
- Local persistence of the selected language.
- Error screen for unregistered routes.

### Pulmonary nodules

- **Fleischner 2017** for solid, ground-glass, and part-solid nodules; single or multiple; low or high risk.
- Rounding to the nearest whole millimeter before thresholds are applied.
- **Lung-RADS v2022** with examination context, nodule status, diameter/volume, solid component, growth, juxtapleural morphology, airway nodules, atypical pulmonary cysts, category 4X, and the S modifier.
- Conversion between volume and equivalent spherical diameter.
- Lung-RADS growth support using an increase greater than 1.5 mm within 12 months.
- The **complete Brock/PanCan model**, with published coefficients and validation of the implemented input ranges.
- References and critical application points.

### Cystic renal lesions

- **Bosniak v2019** for CT and MRI, including applicability, acquisition, content, wall, septa, calcification, and enhancing protrusions.
- Guardrails for masses that are not predominantly cystic, alternative etiologies, hereditary syndromes, ultrasound-only assessment, noncontrast examinations, potentially limiting calcification, and heterogeneous nonenhancing masses on CT.
- Suggested structured report sentence with sharing through the operating system's share sheet.
- Classification kept separate from management recommendations.
- CT and MRI enhancement calculator with an unequivocal visual-enhancement option.
- **CUA 2023** reference management by class, size, symptoms, comorbidity/life expectancy, and solid biopsy target.

### Liver — LI-RADS

- **LI-RADS CT/MRI v2018** for untreated observations in the source-defined adult high-risk population.
- LR-NC, LR-1 through LR-5, LR-M, and LR-TIV categories, with major features and contextual guardrails.
- **Treatment Response Assessment v2024**, with separate pathways for radiation and nonradiation therapies.
- Recording of Couinaud segment, pretreatment category and size, and measurable enhancing component.
- MRI ancillary features applied only in the specified contexts.

Details: [`docs/LI-RADS.md`](docs/LI-RADS.md).

### Fractures — AO/OTA 2018

- Hierarchical adult-fracture browser covering **31 major regions** from the compendium.
- Selection of type, group, and, where implemented, subgroup, followed by generation of the corresponding AO/OTA code.
- Proximal, middle, or distal third qualifier for compatible shaft regions.
- Included regions: humerus, radius, ulna, scapula, clavicle, femur, patella, tibia, fibula, malleolar segment, pelvic ring, acetabulum, hand/carpus, foot, cervical spine, thoracolumbar spine, sacrum, ribs, and sternum.
- **OTA Open Fracture Classification (OTA-OFC)** with five independent components: skin, muscle, arterial injury, contamination, and bone loss.
- **AO Pediatric Comprehensive Classification of Long Bone Fractures (PCCF)** code generator for the humerus, radius, ulna, femur, tibia, and fibula.
- **Unified Classification System for Periprosthetic Fractures (UCPF)** with joint/type modifier generation.
- **Dislocation** coding by joint and direction according to the compendium's universal modifiers.
- Reference screen and scope warnings.

The adult browser prioritizes practical coverage of the most relevant regions, types, groups, and subgroups. The interface is text-based and does not redistribute the compendium's PDFs, tables, or illustrations. It does not attempt to reproduce every specific qualifier, universal modifier, or rare combination; the original publication remains the definitive reference.

### Trauma — AAST

- Text-based browser for **32 AAST injury scales** modeled from the publications cited in the application.
- Organization by neck, chest, abdomen, genitourinary, pelvic/reproductive, and extremity regions.
- Condensed, paraphrased criteria by grade, with specific notes on multiplicity, bilaterality, vascular circumference, and limitations of historical sources.
- Dedicated CT tool for the **2018 spleen, liver, and kidney revision**, with classification by the selected criterion, AIS mapping, and multiphase-protocol reminders.
- Explicit separation between anatomic grading and treatment decisions.

Older AAST scales combine operative, anatomic, and radiologic criteria. The application preserves the identified version, uses its own wording, and does not turn grading into a treatment recommendation.

## Internationalization

All clinical content and translatable interface text use:

```text
src/core/i18n/locales/en.json
src/core/i18n/locales/pt.json
```

The files have exact parity across **1,429 keys**. The initial language follows the device when possible, and the user's choice is persisted with AsyncStorage.

The test suite also checks dynamically generated keys for the AO/OTA, PCCF, UCPF, OTA-OFC, and AAST browsers.

## Architecture

```text
RadRef/
├── app/                         # Expo Router routes
├── assets/                      # First-party icon, splash, and favicon
├── docs/                        # Architecture and LI-RADS notes
├── scripts/                     # Tests and i18n audit
└── src/
    ├── components/              # Reusable interface
    ├── content/                 # Bibliographic references
    ├── core/
    │   ├── i18n/                # Provider, dictionaries, and tests
    │   ├── domain.ts            # MessageRef and ClinicalResult
    │   ├── moduleRegistry.ts    # Declarative module registry
    │   └── numbers.ts           # Parsing and rounding
    ├── modules/
    │   ├── lung/                # Pulmonary nodules
    │   ├── renal/               # Cystic renal lesions
    │   ├── liver/               # LI-RADS and treatment response
    │   ├── fracture/            # AO/OTA, OTA-OFC, PCCF, UCPF, dislocations
    │   └── trauma/              # AAST scales and 2018 solid organs
    ├── screens/                 # Home, About, and Not Found
    └── theme.ts                 # Shared visual tokens
```

Domain functions are pure: they do not import React, React Native, Expo, or translations. They return codes and message references that the interface layer resolves. This makes it possible to test rules without a simulator and update a classification system without coupling it to components.

Details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Adding a new module

1. Create `src/modules/<id>/domain` with types, pure functions, and tests.
2. Create `src/modules/<id>/screens` using the shared components.
3. Register the module and its tools in `src/core/moduleRegistry.ts`.
4. Add routes under `app/<id>/`.
5. Add every new key to both dictionaries.
6. Run `npm run validate` and `npm run typecheck`.

## Clinical source versions

- Fleischner Society: **2017**.
- ACR Lung-RADS: **2022**.
- Brock/PanCan: **2013**.
- Bosniak Classification of Cystic Renal Masses: **2019**.
- Canadian Urological Association: **2023**.
- ACR LI-RADS CT/MRI: **2018**.
- ACR LI-RADS Treatment Response Assessment: **2024**.
- AO/OTA Fracture and Dislocation Classification Compendium: **2018**.
- AAST spleen, liver, and kidney Organ Injury Scale: **2018 revision**.
- Other AAST scales: historical versions identified in the consulted primary sources.

Each module's reference screen provides citations and opens the official sources in the system browser.

## Modeling decisions

The reconstruction is not a mechanical translation from Swift to JavaScript. Pulmonary and renal rules were reconstructed from the behavior of the Swift projects; the Fracture and Trauma modules were modeled as independent clinical data structures with condensed/paraphrased content and without redistribution of protected figures or tables.

Key decisions:

- keep classification and management separate;
- do not force categories for nonstandard combinations;
- preserve official codes without reproducing entire pages, drawings, or publication tables;
- explicitly mark partial coverage in the adult AO/OTA browser;
- do not invent grades missing from the consulted historical AAST sources;
- treat the solid-organ tool as imaging-based grading, not a treatment algorithm.

## Privacy and offline operation

- Calculations, classifications, and translations run locally.
- The application does not request patient identification.
- No clinical data is transmitted.
- Only the voluntary opening of bibliographic links requires internet access.

## How to cite

When using RadRef in teaching, research, or a publication, cite the software version used. For the current version:

> SANTOS, Thales Matheus Mendonça. **RadRef** (version 1.1.0) [software]. 2026. Available at: https://github.com/ThalesMMS/RadRef.

Structured metadata for reference managers and GitHub's **Cite this repository** feature is available in [`CITATION.cff`](CITATION.cff). The clinical publications relevant to the module used must also be cited; they are identified on the application's reference screens.

## Rights in source materials

RadRef code is distributed under the MIT License. That license does not extend to third-party marks, classifications, or publications. The application uses original descriptions, identifies its sources, and opens external links. Third-party PDFs, tables, and illustrations are absent from the checked-out source tree and application package. Deleted assets may remain in earlier Git objects until the evidence and history-cleanup requirements in [P-18](PENDING.md#p-18--dependencies-and-first-party-assets) and [P-19](PENDING.md#p-19--git-history-and-code-publication) are completed; do not publish the repository history before then.

## License

MIT. See [`LICENSE`](LICENSE).
