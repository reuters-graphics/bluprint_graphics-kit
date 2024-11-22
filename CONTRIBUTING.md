# Contributing Guide

## Why this?

Most Reuters Graphics repos don't include (or need) contributing guidelines. The ones that do represent critical infrastructure. They also are the ones we most want wider contributions from the team to improve and maintain.

This doc provides for a few simple guidelines to make sure changes are well considered and represent the best ideas for how to move our tools forward while opening up the opportunity for others to ship their next great idea.

## Who can contribute?

Contributions are always welcome from members of the Reuters Graphics team.

Anyone outside our team using this library is welcome to submit PRs or issues, **BUT** if they are designed solely to benefit a use case that isn't ours, they likely won't be merged.

## How should Reuters Graphics staff contribute?

### 🏷️ Make an issue

We recommend your first step is to create an issue on this repo describing what is missing, broken or could be added or improved. (We'll close that issue when we merge your PR.)

- It's helpful if that issue describes what changes you propose to make at a high level so we can agree on a general direction before you write code. That's especially true if code you're writing will change how others need to write theirs.
- If needed, provide any links to best practice guidelines that support the change you want to make.
- Tag others on the team who may have expertise or would contribute to any needed discussion.
- **Always tag an editor.**

### 🧹 Follow code standards

Once you're ready to submit code, be sure it's properly formatted _before_ you ask for a review. The easiest way is to ensure the built-in code formatter (prettier) is working. (It should.)

Be sure to add comments around any tricky bits of logic you're adding.

### 📝 Write docs

New components or features may need to be reflected in the [Graphics Kit docs](https://github.com/reuters-graphics/docs_graphics-kit). Your editor will tell you if/how to submit changes, either through a PR or a direct edit on master, as part of your PR review. You can also create a PR on the docs repo and reference it in your PR before review.

### 🍺 Submit code

All code contributions should be made through the normal [GitHub Flow](https://www.w3schools.com/git/git_github_flow.asp#:~:text=The%20GitHub%20flow%20is%20a,Make%20changes%20and%20add%20Commits). Basically, make a branch and submit a pull request, i.e. ...

```bash
git checkout -b my-cool-new-thing
# ...
# Write and commit your code on the new branch and push it up
git commit -a -m "ready for PR"
git push origin my-cool-new-thing
# Make a Pull Request on GitHub!
```

Generally, it's better to avoid bundling several new features or components in a single PR. Breaking them apart into smaller, individual contributions makes them easier to review and manage.

Once you've submitted your PR, tag an editor to review it.

An editor will approve your PR after addressing any issues they see. Once an editor approves and there are no code conflicts, you can merge your PR into master.
