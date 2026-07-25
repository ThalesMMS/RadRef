import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adultFractureRegions,
  adultPatternsAtLevel,
  adultRegionById,
  classifyAdultFracture,
  classifyDislocation,
  classifyOpenFracture,
  classifyPediatricFracture,
  classifyPeriprostheticFracture,
} from './index.ts';

test('adult AO/OTA registry covers all major compendium regions', () => {
  assert.equal(adultFractureRegions.length, 31);
  assert.equal(new Set(adultFractureRegions.map((region) => region.id)).size, adultFractureRegions.length);
  for (const region of adultFractureRegions) {
    assert.ok(region.patterns.length > 0, region.id);
    assert.ok(adultPatternsAtLevel(region, 'type').length > 0, region.id);
    assert.equal(new Set(region.patterns.map((pattern) => pattern.code)).size, region.patterns.length);
  }
});

test('adult AO/OTA builder follows type, group and subgroup hierarchy', () => {
  const result = classifyAdultFracture({
    regionId: 'radiusDistal',
    typeCode: '2R3A',
    groupCode: '2R3A2',
    subgroupCode: '2R3A2.2',
    shaftThird: 'none',
  });
  assert.equal(result.code, '2R3A2.2');
  assert.equal(result.selectedLevel, 'subgroup');
  assert.equal(result.recommendation.key, 'fracture.adult.pattern.radiusDistal.2R3A22');
});

test('adult shaft qualifier is appended only to shaft regions', () => {
  const shaft = classifyAdultFracture({
    regionId: 'humerusShaft',
    typeCode: '12A',
    groupCode: '12A1',
    shaftThird: 'b',
  });
  assert.equal(shaft.code, '12A1(b)');

  const end = classifyAdultFracture({
    regionId: 'humerusProximal',
    typeCode: '11A',
    shaftThird: 'c',
  });
  assert.equal(end.code, '11A');
});

test('adult builder rejects an invalid parent-child path', () => {
  const result = classifyAdultFracture({
    regionId: 'humerusProximal',
    typeCode: '11A',
    groupCode: '11C1',
    shaftThird: 'none',
  });
  assert.equal(result.code, '—');
  assert.equal(result.recommendation.key, 'fracture.adult.validation.group');
});

test('OTA-OFC preserves independent five-component profile', () => {
  const result = classifyOpenFracture({ skin: 2, muscle: 3, arterial: 1, contamination: 2, boneLoss: 3 });
  assert.equal(result.profile, 'S2-M3-A1-C2-B3');
  assert.equal(result.highestComponent, 3);
  assert.equal(result.severity, 'high');
  assert.equal(result.notes.length, 7);
});

test('arterial ischemia is surfaced as critical in OTA-OFC display severity', () => {
  const result = classifyOpenFracture({ skin: 1, muscle: 1, arterial: 3, contamination: 1, boneLoss: 1 });
  assert.equal(result.severity, 'critical');
});

test('PCCF code builder handles paired-bone location order', () => {
  const radius = classifyPediatricFracture({
    bone: 'radius',
    segment: 'distal',
    subsegment: 'E',
    pattern: 'E2',
    severity: '1',
    qualification: 'none',
  });
  assert.equal(radius.code, '23r-E/2.1');

  const tibia = classifyPediatricFracture({
    bone: 'tibia',
    segment: 'proximal',
    subsegment: 'M',
    pattern: 'M3',
    severity: '2',
    qualification: 'III',
  });
  assert.equal(tibia.code, '41t-M/3.2(III)');
});

test('PCCF rejects incompatible segment and subsegment', () => {
  const result = classifyPediatricFracture({
    bone: 'femur',
    segment: 'diaphyseal',
    subsegment: 'E',
    pattern: 'E1',
    severity: '1',
    qualification: 'none',
  });
  assert.equal(result.code, '—');
  assert.equal(result.recommendation.key, 'fracture.pediatric.validation.subsegment');
});

test('UCPF modifier combines joint and relation to implant', () => {
  const result = classifyPeriprostheticFracture({ joint: 'IV', type: 'B2' });
  assert.equal(result.modifier, '[IVB2]');
  assert.equal(result.severity, 'moderate');
});

test('dislocation code uses joint code and direction modifier', () => {
  const result = classifyDislocation({ joint: '10A', direction: '5b' });
  assert.equal(result.code, '10A[5b]');
  assert.equal(result.notes[0]?.key, 'fracture.dislocation.joint.10A');
});

test('adult region lookup is deterministic', () => {
  assert.equal(adultRegionById('acetabulum').baseCode, '62');
});
