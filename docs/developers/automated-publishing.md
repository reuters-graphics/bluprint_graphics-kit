![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Automated publishing**

# Automating publishing

This graphics kit can publish projects to our RNGS server using GitHub Actions.

To set your project up for automated publishing, make sure your repo is located in the [Reuters Graphics Github org](https://github.com/reuters-graphics) then move and uncomment the YAML file at `.github/publish.yaml` and further configure the publishing conditions per the comments in that file.

## Publishing from a script

If you're triggering your publish job by hitting a GitHub API for your workflow, i.e., `on: workflow_dispatch`, you can follow the following example in Node:

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

If you're going to run [get-google](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/commands.md#get-data-from-google-docs-and-sheets) as part of your workflow you'll need to add the Google credentials file to your repo and set the `GOOGLE_APPLICATION_CREDENTIALS_PATH` environment variable in your workflow config to the path to that file (relative to the root of your project). You can get our Google credentials file from the team 1password account.

#### 🔒 Security

Google credentials are a secret and must be handled sensitively when added to your project.

You must:

1. Keep your project repo **PRIVATE**.
2. Add a `secret` suffix to the Google credentials file in your project, e.g., `google-creds.secret.json`, which will exclude this file when the project archive is made for clients.
