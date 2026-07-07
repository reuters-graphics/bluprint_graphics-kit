import { describe, it, expect } from 'vitest';
import { registry } from './registry';

describe('mods registry', () => {
  it('has unique ids', () => {
    const ids = registry.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every entry has a label, hint and run function', () => {
    for (const mod of registry) {
      expect(mod.label).toBeTruthy();
      expect(mod.hint).toBeTruthy();
      expect(typeof mod.run).toBe('function');
    }
  });

  it('command names are unique where declared', () => {
    const names = registry
      .map((m) => m.command?.name)
      .filter((n): n is string => !!n);
    expect(new Set(names).size).toBe(names.length);
  });

  it('exposes the mods the CLI scripts depend on', () => {
    const ids = registry.map((m) => m.id);
    expect(ids).toContain('project-type');
    expect(ids).toContain('unconfig-rngs-io');
    expect(registry.filter((m) => m.menu).length).toBeGreaterThan(0);
  });
});
