import type { ModContext } from './_core/context';
import { changeProjectType } from './mods/project-type';
import { makeAiEmbed } from './mods/make-ai-embed';
import { makeBlog } from './mods/make-blog';
import { exportAiStatics } from './mods/export-ai-statics';
import { unconfigRngsIo } from './mods/unconfig-rngs-io';

/**
 * Describes a single mod. This is the one source of truth the CLI reads to
 * build both the interactive `mods` menu and any dedicated sade commands —
 * adding a mod means adding one entry here.
 */
export interface ModDescriptor {
  /** Stable id, used for menu dispatch. */
  id: string;
  /** Menu label. */
  label: string;
  /** Menu hint. */
  hint: string;
  /** Whether to show this mod in the interactive `mods` menu. */
  menu: boolean;
  /** Register a dedicated top-level command, e.g. `kit-mods project-type`. */
  command?: {
    name: string;
    options?: [string, string, (string | boolean | number)?][];
  };
  run: (
    ctx: ModContext,
    opts?: Record<string, unknown>
  ) => void | Promise<void>;
}

export const registry: ModDescriptor[] = [
  {
    id: 'export-ai-statics',
    label: 'Export AI statics',
    hint: 'export JPG and EPS files',
    menu: true,
    run: (ctx) => exportAiStatics(ctx),
  },
  {
    id: 'make-ai-embed',
    label: 'Make an embed page',
    hint: 'for ai2svelte graphics',
    menu: true,
    run: (ctx) => makeAiEmbed(ctx),
  },
  {
    id: 'project-type',
    label: 'Change my project type',
    hint: 'to embeds-only or pages+',
    menu: true,
    command: {
      name: 'project-type',
      options: [['-f, --force', 'Force the change', false]],
    },
    run: (ctx, opts) => changeProjectType(ctx, { force: !!opts?.force }),
  },
  {
    id: 'make-blog',
    label: 'Convert to a graphics blog',
    hint: 'posts feed + permalinks (one-way)',
    menu: true,
    command: {
      name: 'make-blog',
      options: [['-f, --force', 'Force the change', false]],
    },
    run: (ctx, opts) => makeBlog(ctx, { force: !!opts?.force }),
  },
  {
    id: 'unconfig-rngs-io',
    label: 'Unconfigure RNGS.io',
    hint: 'use local content instead of live endpoints',
    menu: false,
    command: { name: 'unconfig-rngs-io' },
    run: (ctx) => unconfigRngsIo(ctx),
  },
];
