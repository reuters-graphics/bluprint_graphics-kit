---
name: write-skill
description: Scaffolds a new Claude Code skill with a SKILL.md and a vitest eval. Use when the user asks to create, add, or write a new skill for this project.
argument-hint: '[skill-name] [optional brief description]'
allowed-tools: Read Write Bash
---

## Instructions

### Step 0: Parse the skill name

Extract the skill name from the first word of `$ARGUMENTS`. If `$ARGUMENTS` is empty, ask the user for the skill name before doing anything else.

### Step 1: Guard against overwriting an existing skill

Before asking for anything else, check whether `.claude/skills/<name>/` already exists.

If it does, **stop immediately** and tell the user:

> A skill named `<name>` already exists at `.claude/skills/<name>/`. To avoid overwriting it, choose a different name or edit the existing skill directly.

Do not create any files if the directory already exists.

### Step 2: Gather a brief description if not already provided

If `$ARGUMENTS` contained only the skill name with no description, ask the user what the skill should do before continuing. Do not proceed until you have a clear brief.

### Step 3: Read existing skills for conventions

Read the SKILL.md files of a few existing skills in `.claude/skills/` to match the conventions already established in this project before writing anything.

### Step 4: Create `.claude/skills/<name>/SKILL.md`

Use this structure, filling in the name and description from your gathered brief:

```
---
name: <name>
description: [Tight description — front-load the trigger condition so Claude knows when to auto-invoke. One trigger per branch, no duplication.]
allowed-tools: [only tools this skill genuinely needs, space-separated]
---

## Instructions

[Step-by-step instructions grounded in the brief. Inline what every run needs; link to external reference files for what only some runs use. Strip anything the model already does by default.]
```

Frontmatter notes:

- `allowed-tools` — omit tools the skill never calls.
- Omit `disable-model-invocation` and `user-invocable` unless there is a specific reason — both default to the right behaviour for a normal skill.

### Step 5: Create `.claude/skills/<name>/evals/<name>.eval.ts`

Use the project's standard eval pattern:

```typescript
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type SDKMessage,
  type SDKResultSuccess,
} from '@anthropic-ai/claude-agent-sdk';
import {
  createWorktree,
  removeWorktree,
  type Worktree,
} from '../../_utils/worktree';
import { runSkill } from '../../_utils/runner';

describe('<name>', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();
    messages = await runSkill(
      '<name>',
      '[a realistic prompt that exercises the skill]',
      worktree.path
    );
  });

  afterAll(() => {
    removeWorktree(worktree);
  });

  it('was invoked via the skill system', () => {
    const result = messages.find(
      (m): m is SDKResultSuccess => m.type === 'result' && !('error' in m)
    );
    expect(result?.is_error).toBe(false);
    expect(result?.num_turns).toBeGreaterThan(0);
    expect(result?.stop_reason).toBe('end_turn');
  });

  // Add skill-specific assertions that check the output files or state
  // left behind in the worktree after the skill runs.
});
```

### Step 6: Remind the user

After creating both files, tell the user:

> ⚠️ **Skills must be committed before their evals can run.**
>
> The eval system creates a worktree from HEAD — uncommitted files are invisible to it. Once you're happy with the skill, commit and test:
>
> ```sh
> git add .claude/skills/<name>/
> git commit -m "add <name> skill"
> pnpm test:skills
> ```
