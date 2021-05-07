![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Automating publishing

This graphics kit can publish projects to our RNGS server using GitHub Actions.

To set your project up for automated publishing, create a YAML file in `.github/workflows/`, for example, `.github/workflows/publish.yaml`, and make sure your repo is located in the [Reuters Graphics Github org](https://github.com/reuters-graphics).

## YAML Configuration

Your configuration might look something like this:

```yaml
# .github/workflows/publish.yaml
name: Publish page

on: workflow_dispatch

jobs:
  publish-page:
    name: Publish page
    runs-on: ubuntu-latest
    env:
      SERVER_WORKFLOW: true
      # These secrets are automatically available in PRIVATE repos in Reuters Graphics org
      GRAPHICS_SERVER_USERNAME: ${{ secrets.GRAPHICS_SERVER_USERNAME }}
      GRAPHICS_SERVER_PASSWORD: ${{ secrets.GRAPHICS_SERVER_PASSWORD }}
      GRAPHICS_SERVER_API_KEY: ${{ secrets.GRAPHICS_SERVER_API_KEY }}
      SKIP_BUILD_GIT_COMMIT: true
      GOOGLE_APPLICATION_CREDENTIALS_PATH: google-auth.json # Must add to repo if calling get-google
      GRAPHICS_SERVER_PUBLISH: true
      GRAPHICS_SERVER_PUBLISH_TO_MEDIA: true # Optional
      GRAPHICS_SERVER_PUBLISH_TO_LYNX: true # Optional
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: git config user.name hobbes7878
      - run: git config user.email jon.r.mcclure@gmail.com
      - run: npm install
      - run: npm run get-google # Optional to update google docs content
      - run: npm run upload
      - run: npm run publish:publish
```

You can then publish your project from the Actions tab in the repo.

## Publishing from a script

You can trigger publishing by hitting a GitHub API for your workflow. Here's an example in Node:

```javascript
const axios = require('axios');

const URL =
  'https://api.github.com/repos/reuters-graphics/<YOUR REPO>/actions/workflows/publish.yaml/dispatches';

try {
  await axios.post(
    URL,
    {
      ref: 'master',
    },
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${process.env.WORKFLOW_AUTH_TOKEN}`,
      },
    }
  );
} catch (error) {
  console.error(error);
}
```

Your `WORKFLOW_AUTH_TOKEN` in the above example should be a GitHub personal access token with write access to the project repo. **Make sure you treat this token as a secret in your repositories.**

## Metadata

All metadata for your project **must** already be filled in before automatically publishing in GitHub actions. The easiest way to ensure it is is to upload your project to RNGS locally first, which will trigger prompts for any missing metadata.

## Google auth

If you're going to run get-google as part of your workflow you'll need to add the Google credentials file to your repo and set the `GOOGLE_APPLICATION_CREDENTIALS_PATH` environment variable in your workflow config to the path to that file (relative to the root of your project). You can get our Google credentials file from the team 1password account.

**Remember, you must keep this repo PRIVATE.**
