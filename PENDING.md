# Prerequisites for external release

This document tracks the permissions, assessments, and approvals that must be completed before RadRef is distributed outside private development or testing environments. This includes publication on GitHub, web distribution, and release through the Apple App Store or Google Play.

> **Release block:** do not publish an external release while any applicable item is marked `PENDING` or `UNDER REVIEW`.

This checklist is not legal or regulatory advice. A decision that authorization is unnecessary must be recorded in writing by a qualified professional and retained with the other release evidence. Proper citation is mandatory, but it does not replace a license, trademark authorization, permission to create a derivative work, or medical-device clearance.

## Status definitions

- `PENDING`: the contact, assessment, or document has not been started or completed.
- `UNDER REVIEW`: a request has been submitted or an assessment is in progress.
- `AUTHORIZED`: authorization has been received and covers the intended use.
- `NOT APPLICABLE`: a written decision establishes that the item does not apply, with its rationale and responsible person identified.
- `BLOCKED`: authorization was denied or its terms are incompatible; the corresponding content must be removed or redesigned before release.

## 1. Rights in classifications and clinical content

### P-01 — ACR Lung-RADS® v2022

- **Status:** `PENDING`.
- **Rights holder/contact:** American College of Radiology (ACR), through the **Request Permission for Lung-RADS** form on the [official Lung-RADS page](https://www.acr.org/clinical-resources/clinical-tools-and-reference/reporting-and-data-systems/lung-rads).
- **Request authorization for:** interactive implementation of categories and recommendations; Portuguese and English interfaces; adaptation/paraphrase; use of the names `ACR` and `Lung-RADS®`; free or commercial distribution as open-source software, on the web, iOS, and Android; store screenshots and descriptions.
- **Include in the request:** implemented version, intended professional audience, absence of original PDFs/tables/figures, attribution format, educational-use warning, and the possibility of future changes.
- **Required evidence:** an ACR license, agreement, or written message defining scope, versions, territories, platforms, term, attribution, and any restrictions.

### P-02 — ACR LI-RADS® CT/MRI v2018 and TRA v2024

- **Status:** `PENDING`.
- **Rights holder/contact:** American College of Radiology, through the **Request Permission for LI-RADS** form and `RADS@acr.org`, both listed on the [official LI-RADS page](https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/LI-RADS).
- **Request authorization for:** interactive diagnosis and treatment-response algorithms; LR categories and terminology; PT/EN translation; adaptation/paraphrase; use of the names `ACR` and `LI-RADS®`; distribution through the same channels planned for RadRef.
- **Highlight in the request:** use of CT/MRI v2018, Nonradiation TRA v2024, and Radiation TRA v2024; absence of reproduced PDFs, tables, and figures; deliberate scope differences described in `docs/LI-RADS.md`.
- **Required evidence:** a written response or license specifying conditions for use, translation, updates, attribution, and presentation of the marks.

### P-03 — AO/OTA Fracture and Dislocation Classification Compendium—2018

- **Status:** `PENDING`.
- **Rights holders to consult:** AO Foundation and Orthopaedic Trauma Association (OTA). The compendium identifies the two organizations as joint copyright holders.
- **Starting points:** the [official AO/OTA classification page](https://www.aofoundation.org/trauma/clinical-library-and-tools/journals-and-publications/classification) and [AO Foundation contact page](https://www.aofoundation.org/who-we-are/contact).
- **Request authorization or written confirmation for:** the AO/OTA code tree; region, type, group, and subgroup nomenclature; PCCF; dislocation modifiers; PT/EN translation; nominative use of the `AO`, `OTA`, and `AO/OTA` marks; interactive implementation in open-source software and possible commercial distribution.
- **Include in the request:** the module is text-based, declares partial coverage, and contains no AO/OTA PDFs, tables, posters, drawings, logos, or plates.
- **Reason for the block:** the [AO Foundation terms](https://www.aofoundation.org/disclaimer) restrict reproduction, commercial exploitation, and derivative works based on AO material without written permission. Free availability or permission for personal use does not automatically authorize redistribution in another application.
- **Required evidence:** joint authorization or sufficient confirmation from every relevant rights holder, including attribution, trademark, version, platform, and commercial-use terms.

### P-04 — OTA Open Fracture Classification and UCPF

- **Status:** `PENDING`.
- **Assessment owner:** intellectual-property counsel.
- **Action:** identify who controls the rights in each original classification, its text, and its publication; consult the OTA, authors, publisher, and/or RightsLink as the analysis requires.
- **Request or confirm:** permission to implement the OTA-OFC five-component structure and UCPF codes, including translation and interactive presentation.
- **Required evidence:** a license from the rights holder or a written opinion concluding that the current independently authored implementation requires no additional license and identifying which content may remain.

### P-05 — AAST injury scales

- **Status:** `PENDING`.
- **Rights holder identified by the source:** the AAST states that it does not own the copyright in the tables and directs users to request permission from Wolters Kluwer through RightsLink for each original article. See the [official AAST guidance](https://www.aast.org/resources/trauma-tools/injury-scoring-scale.html).
- **Request authorization for:** an adapted and condensed digital representation of the 32 scales; PT/EN translation; criteria for each grade; the dedicated 2018 spleen, liver, and kidney tool; open distribution and possible commercial use.
- **Clarify in the request:** no original layout, ICD codes, PDFs, or tables are reproduced; the content is condensed and paraphrased but preserves clinical grades and criteria.
- **Required evidence:** RightsLink/Wolters Kluwer licenses for all applicable articles or a written opinion defining which factual elements may remain without a license.

### P-06 — Fleischner Society 2017 and Bosniak v2019

- **Status:** `PENDING`.
- **Rights holder/publisher to consult:** Radiological Society of North America (RSNA), subject to each article's license.
- **Action:** establish whether each source article has an open license and record its exact terms. The RSNA states that material marked only as free to access does not authorize reuse; non-open material requires a RightsLink request. See [RSNA Permissions and Policies](https://www.rsna.org/journals/permissions-and-policies).
- **When applicable, request authorization for:** implementation of the rules in software, translation, recommendation text, interactive classification, and distribution through the intended channels.
- **Required evidence:** the archived open license and its obligations, a RightsLink license, or a written legal opinion defining the permitted implementation.

### P-07 — Brock/PanCan model and CUA 2023 recommendations

- **Status:** `PENDING`.
- **Assessment owner:** intellectual-property counsel.
- **Brock action:** confirm with the publisher of the original paper whether software distribution of the coefficients and formula, and use of the `Brock/PanCan` name, require authorization.
- **CUA action:** record the exact license for the guideline version used and determine whether it permits adaptation, translation, and possible commercial use.
- **Required evidence:** archived terms/licenses or written responses from the rights holders; if the conclusion is that permission is unnecessary, retain an opinion distinguishing facts, formulas, methods, and protected wording.

### P-08 — Trademarks and application name

- **Status:** `PENDING`.
- **Action:** perform a clearance search for `RadRef` at the Brazilian National Institute of Industrial Property (INPI) and in each distribution territory; check for similar names in medical software and app stores.
- **Additional action:** confirm that screenshots, icons, metadata, and promotional material do not imply affiliation, certification, or endorsement by the ACR, AO Foundation, OTA, AAST, RSNA, CUA, or other organizations.
- **Required evidence:** search report and legal approval of the name; obtain written authorization before using any third-party logo, seal, visual identity, or partnership claim.

## 2. Medical-device regulation in Brazil

### P-09 — RadRef SaMD determination

- **Status:** `PENDING`.
- **Responsible party:** a regulatory professional or consultancy experienced in medical software in Brazil.
- **Action:** formalize intended purpose, users, indications, inputs, outputs, claims, risks, and the application's role in clinical decisions; then issue a classification analysis under RDC 657/2022 and Rule 12 of RDC 751/2022.
- **Official sources:** [ANVISA questions and answers on RDC 657/2022](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas) and the [medical-device regulatory overview](https://www.gov.br/anvisa/en/regulation-of-products/medical-devices).
- **Required evidence:** a signed regulatory opinion concluding `SaMD` or `not regulated`, with its rationale, risk class when applicable, and permitted claim boundaries.
- **Rule:** the “educational use” warning must not substitute for assessment of the software's actual function and intended purpose.

### P-10 — ANVISA notification or registration, if applicable

- **Status:** `PENDING`, dependent on P-09.
- **If RadRef is SaMD:** identify the responsible legal entity, applicable company authorization/AFE, risk class, notification or registration pathway, technical documentation, clinical evidence, risk management, security, labeling/instructions for use, and post-market obligations.
- **Action:** obtain the applicable regulatory act before offering the product in Brazil and ensure that application and store descriptions match the authorized intended purpose.
- **Required evidence:** notification/registration number and corresponding official documents, or the formal basis for an exemption where applicable.

### P-11 — Other countries and territories

- **Status:** `PENDING`.
- **Action:** initially limit availability to Brazil or obtain a territory-specific regulatory assessment before enabling each additional market.
- **Required evidence:** a country matrix with regulatory classification, legal manufacturer/representative when necessary, and the applicable authorization, registration, clearance, or exemption number.

## 3. Clinical and safety approvals

### P-12 — Independent clinical review

- **Status:** `PENDING`.
- **Action:** obtain documented review by independent specialists for each module:
  - thoracic radiology: Fleischner, Lung-RADS, and Brock;
  - abdominal radiology/uroradiology and urology: Bosniak and CUA;
  - abdominal radiology/hepatology: LI-RADS diagnosis and TRA;
  - musculoskeletal radiology/orthopedics: AO/OTA, OTA-OFC, PCCF, UCPF, and dislocations;
  - emergency radiology/trauma surgery: AAST scales.
- **Minimum scope:** fidelity to cited versions, translation, thresholds, units, tie-breaking, guardrails, shareable text, and uncovered situations.
- **Required evidence:** signed report, documented conflicts, completed corrections, and final approval of the release candidate.

### P-13 — Safety validation and change management

- **Status:** `PENDING`.
- **Action:** appoint a clinical owner and define source-version control, update procedures, a risk register, withdrawal/correction criteria, and a public channel for reporting clinical errors.
- **Required evidence:** an approved plan and a release candidate traceable to its tests, clinical review, and source materials.

### P-14 — Research use or real-world data

- **Status:** `PENDING` until the determination and its required evidence are recorded.
- **Action:** document whether the current release collects patient data, conducts research involving human participants, or is intended for prospective validation. If the determination is `NOT APPLICABLE`, record the rationale, responsible person, decision date, and supporting evidence before changing this status or the corresponding table row.
- **Required evidence:** a signed and dated determination identifying the reviewer, assessed release scope, factual basis, and location of the retained evidence.
- **Reopening rule:** before any prospective study, data collection, clinical telemetry, or participant-based validation, obtain an assessment from CEP/CONEP or the competent ethics committee, informed consent where required, and institutional approval.

## 4. Privacy, terms, and app-store release

### P-15 — Privacy policy and terms of use

- **Status:** `PENDING`.
- **Action:** publish a privacy policy at a public, non-geofenced URL even if the current version states that it collects no data; document external links, local sharing, logs, telemetry, crash reporting, and any service added in the future.
- **Additional action:** obtain legal review of the terms of use, limitations of liability, professional audience, support, jurisdiction, and educational-use wording.
- **Required evidence:** approved URLs and document versions that match the application's actual behavior.

### P-16 — Apple App Store

- **Status:** `PENDING`.
- **Action:** publish through an appropriate legal entity, complete privacy declarations, present methodology/accuracy evidence, and attach regulatory documentation when applicable.
- **Official source:** [App Review Guideline 1.4.1](https://developer.apple.com/app-store/review/guidelines/#physical-harm) provides for increased scrutiny of medical apps that support diagnosis or treatment and requests regulatory-clearance documentation when available.
- **Required evidence:** Apple Developer Program account/agreement, App Review approval, and an archive of every submitted declaration and document.

### P-17 — Google Play

- **Status:** `PENDING`.
- **Action:** accurately complete the Health apps declaration, classify the functionality as Clinical Decision Support or Medical Device according to P-09, and publish the required privacy policy.
- **Conditional regulatory path:** if P-09 classifies RadRef as SaMD, provide the applicable regulatory approval, clearance, or certification evidence. A non-medical-device disclaimer may be used only if the formal P-09 assessment concludes that no medical-device authorization is required; retain that conclusion and ensure the disclaimer and store metadata match it.
- **Official sources:** [Google Play — Health Content and Services](https://support.google.com/googleplay/android-developer/answer/16679511) and [Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291).
- **Required evidence:** Play Console account/agreement, archived declaration, review approval, the P-09 determination, and either the applicable regulatory documents or the approved non-medical-device disclaimer.

### P-18 — Dependencies and first-party assets

- **Status:** `PENDING`.
- **Action:** audit licenses for every dependency included in the package and generate all required third-party notices.
- **Additional action:** retain proof of authorship/license for the icon, splash, favicon, fonts, and other graphics; confirm that no removed asset remains in the application package or checked-out source tree.
- **Required evidence:** license report, notices file, asset inventory, and final scan of the distributed artifact.

### P-19 — Git history and code publication

- **Status:** `PENDING`.
- **Action:** rewrite history before the first public release to remove previously versioned third-party PDFs and plates; inspect refs, tags, branches, releases, and reachable objects.
- **Additional action:** scan for secrets, personal data, licensed files, and binaries before the first public push.
- **Required evidence:** cleanup/scan report, final diff review, and explicit approval from the repository owner.

## 5. Request log

Complete one row for every contact or determination. Store received documents outside the public repository if they contain personal data, prices, confidential clauses, or signatures.

| ID | Rights holder/authority | Owner | Request date | Reference | Status | Evidence/secure location |
| --- | --- | --- | --- | --- | --- | --- |
| P-01 | ACR — Lung-RADS | Unassigned | — | — | PENDING | — |
| P-02 | ACR — LI-RADS | Unassigned | — | — | PENDING | — |
| P-03 | AO Foundation/OTA | Unassigned | — | — | PENDING | — |
| P-04 | OTA-OFC/UCPF | Unassigned | — | — | PENDING | — |
| P-05 | Wolters Kluwer/RightsLink — AAST | Unassigned | — | — | PENDING | — |
| P-06 | RSNA — Fleischner/Bosniak | Unassigned | — | — | PENDING | — |
| P-07 | Brock/PanCan and CUA | Unassigned | — | — | PENDING | — |
| P-08 | Name and trademarks | Unassigned | — | — | PENDING | — |
| P-09 | ANVISA classification | Unassigned | — | — | PENDING | — |
| P-10 | ANVISA regulatory pathway | Unassigned | — | — | PENDING | — |
| P-11 | Other territories | Unassigned | — | — | PENDING | — |
| P-12 | Clinical review | Unassigned | — | — | PENDING | — |
| P-13 | Clinical safety | Unassigned | — | — | PENDING | — |
| P-14 | Research ethics | Unassigned | — | — | PENDING | Record the formal determination before changing status |
| P-15 | Privacy and terms | Unassigned | — | — | PENDING | — |
| P-16 | Apple | Unassigned | — | — | PENDING | — |
| P-17 | Google | Unassigned | — | — | PENDING | — |
| P-18 | Dependencies and assets | Unassigned | — | — | PENDING | — |
| P-19 | Git history | Unassigned | — | — | PENDING | — |

## 6. Release criteria

A version may be approved for external release only when:

- [ ] every applicable item is `AUTHORIZED` or `NOT APPLICABLE` with supporting evidence;
- [ ] permissions cover the intended version, language, platform, territory, and business model;
- [ ] the public intended purpose and claims match the regulatory determination;
- [ ] independent clinical review of the release candidate is approved;
- [ ] the privacy policy, terms, support channel, and correction procedure are published;
- [ ] the final artifact and Git history contain no unauthorized material or secrets;
- [ ] store documentation is consistent with the application and its regulatory authorization;
- [ ] the product owner has signed the final release decision.

## 7. Changes that reopen the assessment

Reassess permissions before any release that adds:

- a new version of a classification or guideline;
- a new language, country, platform, or monetization model;
- third-party tables, images, logos, layouts, or verbatim text;
- a claim of diagnosis, prognosis, treatment recommendation, or replacement of professional judgment;
- storage, transmission, analytics, or integration involving patient data;
- institutional association, endorsement, certification, or partnership;
- use of the application in research involving human participants.

Last reviewed: **August 16, 2026**.
