# Git workflow

## ⚠️ Push and pull to `gfx`, not `main`

**This project's working branch is `gfx`.** Do all day-to-day work on `gfx` and push and pull there. Scaffolding leaves you checked out on `gfx` already.

**Do not push to `main`.** It is the protected default branch and direct pushes are blocked.

## Why

Our company applies branch-protection rules to the default branch (`main`) on every repo: after the initial push you can't push to it without opening a formal PR, and the company's PR security checks take too long to clear on deadline.

Our team works differently — several developers share one branch at once, each owning a different graphic or part of the app, and we publish straight from our own machines. The publishing tools upload the files on your machine regardless of which branch you're on, so the branch name has no bearing on what ships. To keep moving on deadline we treat **`gfx`** as the de-facto working branch and leave `main` as the untouched, protected default.

## How it's set up

- `main` — pushed once at scaffold time, then left alone. It's the protected default branch on GitHub.
- `gfx` — the shared working branch. Created and pushed at scaffold time; this is where everyone commits.
- Multiple developers commit to `gfx` at the same time, so **pull often** (`git pull`) to stay in sync and avoid conflicts.

## When the restriction is lifted

This is a **temporary workaround** while we negotiate to have the default-branch restriction removed from our team's repos. Once it's lifted, migrate this project back to a normal `main` workflow:

1. Merge `gfx` into `main`: `git checkout main && git merge gfx`
2. Push `main` and resume working on it: `git push origin main`
3. Delete the working branch: `git branch -d gfx && git push origin --delete gfx`
