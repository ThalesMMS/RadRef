# Ultrasound reference measurements

## Scope

A reference-only module, available from the central module registry. Eleven exam subsections have stable Expo routes: abdominal, urinary, prostate, thyroid/neck, breast/axilla, pelvic/transvaginal, obstetric, scrotal, vascular Doppler, musculoskeletal and pediatric ultrasound. This is an initial selection of commonly used measurements, not a complete ultrasound atlas or a complete protocol for every exam.

Each entry includes a value with its unit (or an explicit context-dependent statement), population, acquisition technique, interpretation limitations and source links. The content is available offline in English and Portuguese. Only opening an external publication uses the network. There are no patient inputs, storage, classifications, diagnosis generators or hidden treatment recommendations.

## Implementation

- `src/modules/ultrasound/catalog.ts`: typed, bilingual catalog and pure search functions; no React or networking dependencies.
- `src/modules/ultrasound/i18n.ts`: generated flat dictionaries merged into the existing provider. The catalog is the single source for measurement translations.
- `src/modules/ultrasound/screens.tsx`: module hub, shared exam browser and bibliography; reuses the app's grouped sections, navigation, favorites, typography and theme. The existing renal/teal accent is intentionally reused rather than expanding the global palette.
- `app/ultrasound/*.tsx`: concrete wrappers, compatible with the existing route-file tests. Exam identity is a TypeScript union, not an unchecked URL parameter.
- Search on the hub covers all entries; search inside an exam remains scoped to that exam. Normalization ignores accents, case and repeated whitespace; all query words must match. Changing language recomputes the results. Clear and empty-result states are present.
- Source links have accessible labels, touch targets and a visible error state when opening fails.

## Editorial rules

Sources were consulted on **2026-09-22**. This date records literature consultation, not independent clinical approval. Publication titles, years and canonical URLs are in `ultrasoundSources`; each measurement references one or more source IDs. Source bibliographic titles remain in their publication language. The entries are brief original paraphrases; published tables, PDFs and illustrations are not redistributed.

`reference`, `criterion`, `mean`, `formula` and `context` are deliberately distinct. A source-specific reference is not a universal normality claim. Means are not individual normal ranges, diagnostic thresholds are not reassuring normal limits, and an unmeasurable structure must not be treated as a zero value. The UI never automatically labels a patient as normal or abnormal.

Important review points:

- **Postmenopausal bleeding:** ACOG's April 2026 update supersedes the older ultrasound-only approach for most patients. The 4-mm entry explicitly does not exclude cancer and cites the update. Committee Opinion 734 is retained only to identify the historical threshold and measurement technique; it is not treated as current stand-alone triage advice.
- **Carotids:** the IAC November 2023 no-plaque composite is used, including PSV, EDV and ICA/CCA ratio. Low velocity alone is not sufficient; plaque, near-occlusion and stented arteries require different interpretation. No stenosis-grading algorithm is implemented.
- **Aorta:** ACC/AHA §3.2.5 uses `>3.0 cm`, whereas its surveillance group begins at `3.0 cm`. The entry states both conventions and explicitly prevents treating exactly 3.0 cm as an all-clear result. No intervention or follow-up calculator is implemented.
- **Prostate:** the EAA reference cohort is healthy fertile men aged 23–53; these values are not age-independent BPH criteria.
- **Testicular volume:** the Lambert coefficient 0.71 is displayed with cm-to-mL units and must not be compared directly with ellipsoid 0.52-based ranges. This is a formula reference, not an interactive calculator.
- **Pediatric kidneys and fetal biometry:** users are directed to population/height/gestation-appropriate charts; percentiles and pregnancy dating are not calculated.
- **Median nerve:** the pooled mean is labeled as such; a confidence interval of the mean is not presented as an individual normal interval.
- **Thyroid isthmus:** 3–5 mm describes differing upper limits, not a lower-to-upper normal interval.

## Validation

New tests are discovered by the existing `npm test` runner and can be run independently:

```sh
node --no-warnings --experimental-strip-types --test src/modules/ultrasound/catalog.test.ts
```

They cover catalog/source integrity, complete bilingual content, dictionary and interpolation parity, concrete exam routes, search behavior, exam isolation and explicit safety contexts. They test software/content invariants; they do not establish diagnostic accuracy.

Before merging, run the repository's complete checks in an environment with installed dependencies:

```sh
npm ci
npm run validate
npx expo export --platform web
```

Manual review still required: native iOS/Android navigation and back behavior; PT/EN changes from an exam; global and scoped searches with accents and no results; favorites; light/dark themes; large text and screen readers; offline reference access and link failure behavior. Have an independent radiologist review every value, inequality, unit, population, measurement plane, citation and translation before clinical deployment. Additional exam types and measurements should be added only with an identified source and the same validation rules.
