# Lymph node reference measurements

The `/lymph` module is a source-linked lookup, not a malignancy classifier, a staging tool, or a follow-up recommendation. It reuses the existing screens, grouped sections, reference links, tool switcher, favourites, search registry and EN/PT localisation. The existing teal (`renal`) palette is reused without changing the shared theme.

## Scope and provenance

There are 29 entries: 10 cervical, 11 thoracic and 8 abdominal. Values are short-axis measurements in millimetres; every entry carries an evidence category, a context note and links to its supporting publication. Cervical level names organise a general criterion; they do not imply independent normal-population validation for each level.

| Entries | Measurement | Meaning and source |
| --- | --- | --- |
| General cervical levels I–VI, except jugulodigastric | ≥10 mm | Head-and-neck cancer size criterion, not a universal normal limit [1,2] |
| Jugulodigastric/subdigastric | ≥11 mm | Specific exception, not all level II [1,2] |
| Lateral retropharyngeal | ≥5 mm | MRI criterion used in the nasopharyngeal carcinoma protocol of Tang et al. [2] |
| Median retropharyngeal | Any visible node | Qualitative criterion in the same NPC protocol, not a zero-mm normal limit [2] |
| Eight named mediastinal groups | 10 mm | General upper CT size reference, not separately validated modern station cutoffs [3] |
| Right hilar anterior upper-lobe / inferior interlobar regions | 12 mm | Direct anatomical measurements, not CT thresholds [4] |
| Right superior interlobar; left anterior upper-lobe / inferior interlobar regions | 10 mm | Direct anatomical measurements [4] |
| Other hilar regions in that study | 8 mm | Direct anatomical measurements [4] |
| Retrocrural | 6 mm | Upper CT reference [5] |
| Paracardiac (upper abdominal study) | 8 mm | Upper CT reference [5] |
| Gastrohepatic ligament | 8 mm | Upper CT reference [5] |
| Porta hepatis | 7 mm | Upper CT reference [5] |
| Portacaval | 10 mm | Upper CT reference [5] |
| Upper para-aortic | 9 mm | Upper CT reference [5] |
| Lower para-aortic | 11 mm | Upper CT reference [5] |
| Mesenteric | Usually <5 mm | Observational finding, not a universal upper limit [6] |

The hilar divisions are the original anatomical subdivisions, not a mapping to modern IASLC station numbers. The mesenteric study found a mean largest node of 4.8 mm (range 3–9 mm); the app does not equate ≥5 mm with malignancy or adenitis. The retropharyngeal criteria must not be extrapolated to all incidental nodes. This is not a paediatric reference table, nor a substitute for thyroid-cancer protocols.

Size alone cannot reliably separate benign and malignant nodes [7]. RECIST 1.1 is a response-assessment framework rather than a regional normal-size table [8]. The UI deliberately does not produce a reassuring green “normal”, a red “malignant” result, or an automatic management recommendation.

## Primary references

1. van den Brekel MW et al. **Cervical lymph node metastasis: assessment of radiologic criteria.** Radiology. 1990;177:379–384. [DOI](https://doi.org/10.1148/radiology.177.2.2217772)
2. Tang LL et al. **Prognostic Value and Staging Classification of Retropharyngeal Lymph Node Metastasis in Nasopharyngeal Carcinoma Patients Treated with Intensity-modulated Radiotherapy.** PLoS ONE. 2014;9:e108375. [DOI / open access](https://doi.org/10.1371/journal.pone.0108375)
3. Glazer GM et al. **Normal mediastinal lymph nodes: number and size according to American Thoracic Society mapping.** AJR. 1985;144:261–265. [DOI](https://doi.org/10.2214/ajr.144.2.261)
4. Kiyono K et al. **Size of Normal Hilar Lymph Nodes Measured in Autopsy Specimens.** Acta Radiologica. 1989;30:471–474. [DOI](https://doi.org/10.1177/028418518903000505)
5. Dorfman RE et al. **Upper abdominal lymph nodes: criteria for normal size determined with CT.** Radiology. 1991;180:319–322. [DOI](https://doi.org/10.1148/radiology.180.2.2068292)
6. Lucey BC et al. **Mesenteric lymph nodes: detection and significance on MDCT.** AJR. 2005;184:41–44. [DOI](https://doi.org/10.2214/ajr.184.1.01840041)
7. Arita T et al. **Is it possible to differentiate malignant mediastinal nodes from benign nodes by size? Reevaluation by CT, transesophageal echocardiography, and nodal specimen.** Chest. 1996;110:1004–1008. [DOI](https://doi.org/10.1378/chest.110.4.1004)
8. Schwartz LH et al. **Evaluation of lymph nodes with RECIST 1.1.** European Journal of Cancer. 2009;45:261–267. [DOI](https://doi.org/10.1016/j.ejca.2008.10.028)

Sources checked on 2026-09-22. Published values and their original populations are retained rather than presented as a new consensus guideline.

## Validation

- 14 new Node tests cover exact values, evidence categories, source integrity, translation and interpolation parity, dynamic keys, search normalisation, registry integration and all five route exports.
- Isolated strict TypeScript checking of the reference data, dictionary and registry passed with TypeScript 5.8.3, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- Syntax/transpilation and direct-UI-literal checks passed for the changed TS/TSX files.
- Full `npm run validate`, Expo bundling and iOS/Android visual testing were **not run**: this environment could read/write GitHub through the connector but could not clone the repository or install its dependencies. The project uses TypeScript 6; the isolated check does not replace the project toolchain.

Run the repository's normal `npm run validate`, then check `/lymph`, its three regional pages, both languages, dark/light mode, favourites, search and external links on a supported device before merging.
