import sade from 'sade';
import { changeProjectType } from './project-type';
import { intro } from '@reuters-graphics/clack';
import { cancel, isCancel, log, outro, select } from '@clack/prompts';
import { exportAiStatics } from './export-ai-statics';
import { makeAiEmbed } from './make-ai-embed';

const prog = sade('kit-mods');

prog
  .command('project-type')
  .option('-f, --force', 'Force the change', false)
  .action(async (opts) => {
    intro('Kit mods');
    log.step('Change project type');
    await changeProjectType(!!opts.force);
    outro('Done.');
  });

prog.command('mods').action(async () => {
  intro('Kit mods');
  const mod = await select({
    message: 'Which mod do you want?',
    options: [
      {
        value: 'export-ai-statics',
        label: 'Export AI statics',
        hint: 'export JPG and EPS files',
      },
      {
        value: 'make-ai-embed',
        label: 'Make an embed page',
        hint: 'for ai2svelte graphics',
      },
      {
        value: 'project-type',
        label: 'Change my project type',
        hint: 'to embeds-only or pages+',
      },
    ],
    initialValue: 'export-ai-statics',
  });
  if (isCancel(mod)) return cancel();
  if (mod === 'export-ai-statics') await exportAiStatics();
  if (mod === 'make-ai-embed') await makeAiEmbed();
  if (mod === 'project-type') await changeProjectType();
  outro('Done.');
});

prog.parse(process.argv);
