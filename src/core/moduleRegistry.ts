export type ModuleAccent = 'lung' | 'renal' | 'fracture' | 'trauma';

/** `reference` tools are source lists; they stay out of the in-module tool switcher. */
export type ToolKind = 'tool' | 'reference';

export type ToolDefinition = Readonly<{
  id: string;
  titleKey: string;
  descriptionKey: string;
  route: string;
  metaKey?: string;
  kind?: ToolKind;
}>;

export type RadiologyModule = Readonly<{
  id: 'lung' | 'renal' | 'liver' | 'fracture' | 'trauma';
  titleKey: string;
  descriptionKey: string;
  shortLabelKey: string;
  route: string;
  guidelineKey: string;
  accent: ModuleAccent;
  tools: readonly ToolDefinition[];
}>;

export const radiologyModules: readonly RadiologyModule[] = [
  {
    id: 'lung',
    titleKey: 'module.lung.title',
    descriptionKey: 'module.lung.description',
    shortLabelKey: 'module.lung.shortLabel',
    route: '/lung',
    guidelineKey: 'module.lung.guidelines',
    accent: 'lung',
    tools: [
      {
        id: 'fleischner',
        titleKey: 'lung.tools.fleischner.title',
        descriptionKey: 'lung.tools.fleischner.description',
        route: '/lung/fleischner',
        metaKey: 'lung.tools.fleischner.meta',
      },
      {
        id: 'lungRads',
        titleKey: 'lung.tools.lungRads.title',
        descriptionKey: 'lung.tools.lungRads.description',
        route: '/lung/lung-rads',
        metaKey: 'lung.tools.lungRads.meta',
      },
      {
        id: 'brock',
        titleKey: 'lung.tools.brock.title',
        descriptionKey: 'lung.tools.brock.description',
        route: '/lung/brock',
        metaKey: 'lung.tools.brock.meta',
      },
      {
        id: 'lungReferences',
        titleKey: 'common.references',
        descriptionKey: 'lung.tools.references.description',
        route: '/lung/references',
        metaKey: 'lung.tools.references.meta',
        kind: 'reference',
      },
    ],
  },
  {
    id: 'renal',
    titleKey: 'module.renal.title',
    descriptionKey: 'module.renal.description',
    shortLabelKey: 'module.renal.shortLabel',
    route: '/renal',
    guidelineKey: 'module.renal.guidelines',
    accent: 'renal',
    tools: [
      {
        id: 'bosniak',
        titleKey: 'renal.tools.bosniak.title',
        descriptionKey: 'renal.tools.bosniak.description',
        route: '/renal/bosniak',
        metaKey: 'renal.tools.bosniak.meta',
      },
      {
        id: 'enhancement',
        titleKey: 'renal.tools.enhancement.title',
        descriptionKey: 'renal.tools.enhancement.description',
        route: '/renal/enhancement',
        metaKey: 'renal.tools.enhancement.meta',
      },
      {
        id: 'management',
        titleKey: 'renal.tools.management.title',
        descriptionKey: 'renal.tools.management.description',
        route: '/renal/management',
        metaKey: 'renal.tools.management.meta',
      },
      {
        id: 'renalReferences',
        titleKey: 'common.references',
        descriptionKey: 'renal.tools.references.description',
        route: '/renal/references',
        metaKey: 'renal.tools.references.meta',
        kind: 'reference',
      },
    ],
  },
  {
    id: 'liver',
    titleKey: 'module.liver.title',
    descriptionKey: 'module.liver.description',
    shortLabelKey: 'module.liver.shortLabel',
    route: '/liver',
    guidelineKey: 'module.liver.guidelines',
    accent: 'trauma',
    tools: [
      {
        id: 'liRads',
        titleKey: 'liver.tools.liRads.title',
        descriptionKey: 'liver.tools.liRads.description',
        route: '/liver/li-rads',
        metaKey: 'liver.tools.liRads.meta',
      },
      {
        id: 'treatmentResponse',
        titleKey: 'liver.tools.treatmentResponse.title',
        descriptionKey: 'liver.tools.treatmentResponse.description',
        route: '/liver/treatment-response',
        metaKey: 'liver.tools.treatmentResponse.meta',
      },
      {
        id: 'liverReferences',
        titleKey: 'common.references',
        descriptionKey: 'liver.tools.references.description',
        route: '/liver/references',
        metaKey: 'liver.tools.references.meta',
        kind: 'reference',
      },
    ],
  },
  {
    id: 'fracture',
    titleKey: 'module.fracture.title',
    descriptionKey: 'module.fracture.description',
    shortLabelKey: 'module.fracture.shortLabel',
    route: '/fracture',
    guidelineKey: 'module.fracture.guidelines',
    accent: 'fracture',
    tools: [
      {
        id: 'adultAoOta',
        titleKey: 'fracture.tools.adult.title',
        descriptionKey: 'fracture.tools.adult.description',
        route: '/fracture/adult',
        metaKey: 'fracture.tools.adult.meta',
      },
      {
        id: 'openFracture',
        titleKey: 'fracture.tools.open.title',
        descriptionKey: 'fracture.tools.open.description',
        route: '/fracture/open',
        metaKey: 'fracture.tools.open.meta',
      },
      {
        id: 'pediatricFracture',
        titleKey: 'fracture.tools.pediatric.title',
        descriptionKey: 'fracture.tools.pediatric.description',
        route: '/fracture/pediatric',
        metaKey: 'fracture.tools.pediatric.meta',
      },
      {
        id: 'periprosthetic',
        titleKey: 'fracture.tools.periprosthetic.title',
        descriptionKey: 'fracture.tools.periprosthetic.description',
        route: '/fracture/periprosthetic',
        metaKey: 'fracture.tools.periprosthetic.meta',
      },
      {
        id: 'dislocations',
        titleKey: 'fracture.tools.dislocations.title',
        descriptionKey: 'fracture.tools.dislocations.description',
        route: '/fracture/dislocations',
        metaKey: 'fracture.tools.dislocations.meta',
      },
      {
        id: 'fractureReferences',
        titleKey: 'common.references',
        descriptionKey: 'fracture.tools.references.description',
        route: '/fracture/references',
        metaKey: 'fracture.tools.references.meta',
        kind: 'reference',
      },
    ],
  },
  {
    id: 'trauma',
    titleKey: 'module.trauma.title',
    descriptionKey: 'module.trauma.description',
    shortLabelKey: 'module.trauma.shortLabel',
    route: '/trauma',
    guidelineKey: 'module.trauma.guidelines',
    accent: 'trauma',
    tools: [
      {
        id: 'solidOrgan',
        titleKey: 'trauma.tools.solidOrgan.title',
        descriptionKey: 'trauma.tools.solidOrgan.description',
        route: '/trauma/solid-organ',
        metaKey: 'trauma.tools.solidOrgan.meta',
      },
      {
        id: 'aastScales',
        titleKey: 'trauma.tools.scales.title',
        descriptionKey: 'trauma.tools.scales.description',
        route: '/trauma/scales',
        metaKey: 'trauma.tools.scales.meta',
      },
      {
        id: 'traumaReferences',
        titleKey: 'common.references',
        descriptionKey: 'trauma.tools.references.description',
        route: '/trauma/references',
        metaKey: 'trauma.tools.references.meta',
        kind: 'reference',
      },
    ],
  },
];

export function moduleById(id: RadiologyModule['id']): RadiologyModule {
  const module = radiologyModules.find((candidate) => candidate.id === id);
  if (!module) throw new Error(`Unknown module: ${id}`);
  return module;
}

/** Sibling tools offered by the in-module switcher — everything except source lists. */
export function switchableTools(id: RadiologyModule['id']): readonly ToolDefinition[] {
  return moduleById(id).tools.filter((tool) => tool.kind !== 'reference');
}
