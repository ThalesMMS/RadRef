import { type ClinicalResult, msg } from '../../../core/domain.ts';
import { roundToNearestMillimeter } from '../../../core/numbers.ts';

export type FleischnerNoduleType = 'solid' | 'ggo' | 'partSolid';
export type PatientRisk = 'low' | 'high';
export type FleischnerSizeBand = 'lt6' | '6to8' | 'gt8';
export type SolidComponentBand = 'none' | 'lt6' | '6to8' | 'gt8';

export type FleischnerInput = Readonly<{
  noduleType: FleischnerNoduleType;
  sizeMm?: number;
  solidComponentMm?: number;
  risk: PatientRisk;
  multiple: boolean;
}>;

export type FleischnerResult = ClinicalResult & Readonly<{
  roundedSizeMm?: number;
  roundedSolidComponentMm?: number;
  sizeBand?: FleischnerSizeBand;
}>;

function sizeBand(size: number): FleischnerSizeBand {
  if (size < 6) return 'lt6';
  if (size <= 8) return '6to8';
  return 'gt8';
}

function solidBand(size: number | undefined): SolidComponentBand {
  if (size === undefined || size <= 0) return 'none';
  if (size < 6) return 'lt6';
  if (size <= 8) return '6to8';
  return 'gt8';
}

function invalid(messageKey: string): FleischnerResult {
  return {
    code: '—',
    title: msg('result.incomplete'),
    recommendation: msg(messageKey),
    notes: [msg('lung.fleischner.scopeNote')],
    severity: 'neutral',
  };
}

function result(
  code: string,
  recommendationKey: string,
  noteKeys: readonly string[],
  severity: ClinicalResult['severity'],
  roundedSizeMm: number,
  roundedSolidComponentMm?: number,
  band?: FleischnerSizeBand,
): FleischnerResult {
  return {
    code,
    title: msg('lung.fleischner.resultTitle'),
    recommendation: msg(recommendationKey),
    notes: noteKeys.map((key) => msg(key)),
    severity,
    roundedSizeMm,
    ...(roundedSolidComponentMm === undefined ? {} : { roundedSolidComponentMm }),
    ...(band === undefined ? {} : { sizeBand: band }),
  };
}

export function calculateFleischner(input: FleischnerInput): FleischnerResult {
  if (input.sizeMm === undefined || !Number.isFinite(input.sizeMm) || input.sizeMm <= 0) {
    return invalid('validation.positiveNoduleSize');
  }

  const roundedSize = roundToNearestMillimeter(input.sizeMm);
  const band = sizeBand(roundedSize);
  const roundedSolid = input.solidComponentMm === undefined
    ? undefined
    : roundToNearestMillimeter(input.solidComponentMm);

  if (input.noduleType === 'partSolid') {
    if (roundedSolid === undefined || !Number.isFinite(roundedSolid) || roundedSolid < 0) {
      return invalid('validation.nonNegativeSolidComponent');
    }
    if (roundedSolid > roundedSize) {
      return invalid('validation.solidNotGreaterThanTotal');
    }
  }

  const contextNote = input.multiple
    ? 'lung.fleischner.multipleDominantNote'
    : 'lung.fleischner.singleContextNote';

  if (input.multiple) {
    if (input.noduleType === 'solid') {
      if (band === 'lt6') {
        return input.risk === 'low'
          ? result('multiple-solid-<6-low', 'lung.fleischner.rec.multipleSolidLt6Low', [contextNote], 'low', roundedSize, undefined, band)
          : result('multiple-solid-<6-high', 'lung.fleischner.rec.multipleSolidLt6High', [contextNote], 'low', roundedSize, undefined, band);
      }
      if (input.risk === 'low') {
        return result('multiple-solid-≥6-low', 'lung.fleischner.rec.multipleSolidGe6Low', [contextNote], 'moderate', roundedSize, undefined, band);
      }
      return result('multiple-solid-≥6-high', 'lung.fleischner.rec.multipleSolidGe6High', [contextNote], 'moderate', roundedSize, undefined, band);
    }

    if (input.noduleType === 'ggo') {
      if (band === 'lt6') {
        return result('multiple-ggo-<6', 'lung.fleischner.rec.multipleGgoLt6', [contextNote, 'lung.fleischner.note.subsolidPersistence'], 'low', roundedSize, undefined, band);
      }
      return result('multiple-ggo-≥6', 'lung.fleischner.rec.multipleGgoGe6', [contextNote, 'lung.fleischner.note.manageMostSuspicious'], 'moderate', roundedSize, undefined, band);
    }

    return result(
      'multiple-part-solid',
      'lung.fleischner.rec.multiplePartSolid',
      [contextNote, 'lung.fleischner.note.manageMostSuspicious'],
      'moderate',
      roundedSize,
      roundedSolid,
      band,
    );
  }

  if (input.noduleType === 'solid') {
    if (band === 'lt6') {
      return input.risk === 'low'
        ? result('single-solid-<6-low', 'lung.fleischner.rec.singleSolidLt6Low', [contextNote, 'lung.fleischner.note.optionalRiskFactors'], 'low', roundedSize, undefined, band)
        : result('single-solid-<6-high', 'lung.fleischner.rec.singleSolidLt6High', [contextNote, 'lung.fleischner.note.optionalRiskFactors'], 'low', roundedSize, undefined, band);
    }
    if (band === '6to8') {
      return input.risk === 'low'
        ? result('single-solid-6-8-low', 'lung.fleischner.rec.singleSolid6to8Low', [contextNote], 'moderate', roundedSize, undefined, band)
        : result('single-solid-6-8-high', 'lung.fleischner.rec.singleSolid6to8High', [contextNote], 'moderate', roundedSize, undefined, band);
    }
    return result(
      'single-solid->8',
      'lung.fleischner.rec.singleSolidGt8',
      [contextNote, 'lung.fleischner.note.gt8Individualize'],
      'high',
      roundedSize,
      undefined,
      band,
    );
  }

  if (input.noduleType === 'ggo') {
    if (band === 'lt6') {
      return result('single-ggo-<6', 'lung.fleischner.rec.singleGgoLt6', [contextNote], 'low', roundedSize, undefined, band);
    }
    return result(
      'single-ggo-≥6',
      'lung.fleischner.rec.singleGgoGe6',
      [contextNote, 'lung.fleischner.note.subsolidFiveYears'],
      'moderate',
      roundedSize,
      undefined,
      band,
    );
  }

  const componentBand = solidBand(roundedSolid);
  if (band === 'lt6') {
    return result('single-part-solid-<6', 'lung.fleischner.rec.singlePartSolidLt6', [contextNote], 'low', roundedSize, roundedSolid, band);
  }
  if (componentBand === 'none' || componentBand === 'lt6') {
    return result(
      'single-part-solid-solid-<6',
      'lung.fleischner.rec.singlePartSolidSolidLt6',
      [contextNote, 'lung.fleischner.note.subsolidFiveYears'],
      'moderate',
      roundedSize,
      roundedSolid,
      band,
    );
  }
  if (componentBand === '6to8') {
    return result(
      'single-part-solid-solid-6-8',
      'lung.fleischner.rec.singlePartSolidSolid6to8',
      [contextNote, 'lung.fleischner.note.partSolidHighlySuspicious'],
      'high',
      roundedSize,
      roundedSolid,
      band,
    );
  }
  return result(
    'single-part-solid-solid->8',
    'lung.fleischner.rec.singlePartSolidSolidGt8',
    [contextNote, 'lung.fleischner.note.partSolidPetLimit'],
    'critical',
    roundedSize,
    roundedSolid,
    band,
  );
}
