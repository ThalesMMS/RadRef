import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aastScaleById,
  aastScales,
  aastScalesForRegion,
  classifySolidOrganCriterion,
  criteriaForSolidOrgan,
  severityForAastGrade,
  solidOrganCriteria,
} from './index.ts';

test('AAST browser contains all 32 archived injury scales', () => {
  assert.equal(aastScales.length, 32);
  assert.equal(new Set(aastScales.map((scale) => scale.id)).size, 32);
  for (const scale of aastScales) {
    assert.ok(scale.grades.length >= 4, scale.id);
    assert.equal(new Set(scale.grades.map((grade) => grade.grade)).size, scale.grades.length);
    assert.ok(scale.grades.every((grade) => grade.criteria.length > 0), scale.id);
  }
});

test('AAST regional grouping accounts for every scale', () => {
  const grouped = [
    ...aastScalesForRegion('neck'),
    ...aastScalesForRegion('thorax'),
    ...aastScalesForRegion('abdomen'),
    ...aastScalesForRegion('genitourinary'),
    ...aastScalesForRegion('pelvicReproductive'),
    ...aastScalesForRegion('extremity'),
  ];
  assert.equal(grouped.length, aastScales.length);
  assert.equal(aastScalesForRegion('thorax').length, 5);
  assert.equal(aastScalesForRegion('abdomen').length, 13);
});

test('2018 solid-organ scales retain AIS severity mapping', () => {
  assert.deepEqual(aastScaleById('spleen').grades.map((entry) => entry.ais), [2, 2, 3, 4, 5]);
  assert.deepEqual(aastScaleById('liver').grades.map((entry) => entry.ais), [2, 2, 3, 4, 5]);
  assert.deepEqual(aastScaleById('kidney').grades.map((entry) => entry.ais), [2, 2, 3, 4, 5]);
});

test('AAST grade severity display is monotonic', () => {
  assert.equal(severityForAastGrade('I'), 'low');
  assert.equal(severityForAastGrade('III'), 'moderate');
  assert.equal(severityForAastGrade('IV'), 'high');
  assert.equal(severityForAastGrade('V'), 'critical');
  assert.equal(severityForAastGrade('VI'), 'critical');
});

test('solid-organ criterion registry is unique and covers all three organs', () => {
  assert.equal(new Set(solidOrganCriteria.map((criterion) => criterion.id)).size, solidOrganCriteria.length);
  assert.equal(criteriaForSolidOrgan('spleen').length, 10);
  assert.equal(criteriaForSolidOrgan('liver').length, 11);
  assert.equal(criteriaForSolidOrgan('kidney').length, 13);
});

test('solid-organ helper returns the criterion grade', () => {
  const spleen = classifySolidOrganCriterion('spleen', 'spleen-g4VascularContained');
  assert.equal(spleen.code, 'IV');
  assert.equal(spleen.severity, 'high');

  const liver = classifySolidOrganCriterion('liver', 'liver-g3VascularContained');
  assert.equal(liver.code, 'III');

  const kidney = classifySolidOrganCriterion('kidney', 'kidney-g5MainVessel');
  assert.equal(kidney.code, 'V');
  assert.equal(kidney.severity, 'critical');
});

test('solid-organ helper rejects a criterion from another organ', () => {
  const result = classifySolidOrganCriterion('spleen', 'kidney-g5MainVessel');
  assert.equal(result.code, '—');
  assert.equal(result.recommendation.key, 'trauma.solidOrgan.validation.criterion');
});
