# LI-RADS implementation

RadRef separates the liver module into two clinically distinct tools:

- **CT/MRI diagnosis v2018** for untreated observations in the defined high-risk population.
- **CT/MRI Treatment Response Assessment v2024** for treated lesions after locoregional therapy or for recurrence at a surgical margin.

## Treatment-response pathways

The v2024 implementation selects the algorithm from the most recent treatment:

- **Nonradiation TRA:** RFA, MWA, cryoablation, PEA, TAE, cTACE, DEB-TACE, and recurrence at a surgical margin.
- **Radiation TRA:** SBRT and TARE.

The nonradiation pathway assigns LR-TR Nonevaluable, Nonviable, Equivocal, or Viable according to assessment of masslike enhancement. The radiation pathway assigns LR-TR Nonevaluable, Nonviable, Nonprogressing, or Viable and requires change over time when masslike enhancement is present.

## Ancillary features

On MRI, diffusion restriction and mild-to-moderate T2 hyperintensity can be used optionally:

- to upgrade nonradiation **LR-TR Equivocal** to **LR-TR Viable** when present in the area of uncertain masslike enhancement;
- to upgrade radiation **LR-TR Nonprogressing** to **LR-TR Viable** when new or increased over time in the area of stable or decreasing masslike enhancement.

These ancillary features are not applied to CT.

## Reporting support

The form records a fixed treated-lesion identifier, Couinaud segment, pretreatment category and size, and the largest masslike enhancing component. The latter is requested for LR-TR Viable, Equivocal, and Nonprogressing results. A share action generates a local, patient-deidentified summary; users should not enter identifying information.

## Guardrails

The treatment-response assistant does not apply to:

- patients outside the defined adult high-risk population;
- noncontrast or single-phase examinations;
- systemic therapy alone;
- new or untreated observations outside the treatment zone;
- targets not considered path-proven or presumed HCC in the selected workflow.

Combination locoregional and systemic therapy is allowed with an explicit caution note.

## Sources

- American College of Radiology Committee on LI-RADS®. *CT/MRI LI-RADS v2018 Core*.
- American College of Radiology Committee on LI-RADS®. *CT/MRI Nonradiation TRA v2024 Core*.
- American College of Radiology Committee on LI-RADS®. *CT/MRI Radiation TRA v2024 Core*.

The official ACR material remains definitive if this implementation and the source differ.
