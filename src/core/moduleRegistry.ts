export type ModuleAccent = 'lung' | 'renal';

export type ToolDefinition = Readonly<{
  id: string;
  titleKey: string;
  descriptionKey: string;
  route: string;
  metaKey?: string;
}>;

export type RadiologyModule = Readonly<{
  id: 'lung' | 'renal';
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
      },
    ],
  },
];

export function moduleById(id: RadiologyModule['id']): RadiologyModule {
  const module = radiologyModules.find((candidate) => candidate.id === id);
  if (!module) throw new Error(`Unknown module: ${id}`);
  return module;
}
