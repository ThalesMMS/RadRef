import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { radiologyModules } from './moduleRegistry.ts';

function routeFile(route: string): string {
  const normalized = route.replace(/^\//, '');
  const direct = join(process.cwd(), 'app', `${normalized}.tsx`);
  if (existsSync(direct)) return direct;
  return join(process.cwd(), 'app', normalized, 'index.tsx');
}

test('module registry identifiers and routes are unique and nested', () => {
  const moduleIds = radiologyModules.map((module) => module.id);
  const moduleRoutes = radiologyModules.map((module) => module.route);
  assert.equal(new Set(moduleIds).size, moduleIds.length);
  assert.equal(new Set(moduleRoutes).size, moduleRoutes.length);

  const toolIds = radiologyModules.flatMap((module) => module.tools.map((tool) => `${module.id}:${tool.id}`));
  const toolRoutes = radiologyModules.flatMap((module) => module.tools.map((tool) => tool.route));
  assert.equal(new Set(toolIds).size, toolIds.length);
  assert.equal(new Set(toolRoutes).size, toolRoutes.length);

  for (const module of radiologyModules) {
    for (const tool of module.tools) {
      assert.ok(tool.route.startsWith(`${module.route}/`), `${tool.route} must be nested under ${module.route}`);
    }
  }
});

test('every registered module and tool route has an Expo Router file', () => {
  for (const module of radiologyModules) {
    assert.ok(existsSync(routeFile(module.route)), `missing route file for ${module.route}`);
    for (const tool of module.tools) {
      assert.ok(existsSync(routeFile(tool.route)), `missing route file for ${tool.route}`);
    }
  }
});
