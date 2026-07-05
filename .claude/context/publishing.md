# Publishing

## Commands

There are three publishing commands with very different effects:

```sh
pnpm preview   # Build and upload to a private S3 preview URL — never public, auto-deleted after publish
pnpm upload    # Build and upload to the Sphinx graphics server — staged but NOT yet live
pnpm pub       # Make a previously uploaded project live on the Sphinx server and reuters.com
```

`preview` is safe to run at any time. `upload` and `pub` affect the live graphics infrastructure.

## ⚠️ Never run upload or pub autonomously

**Do not run `pnpm upload` or `pnpm pub` without explicit instruction from the user.**

`pnpm pub` makes a graphic publicly accessible on reuters.com and to media clients via Reuters Connect. It requires editorial authorisation and must only be run when a human has specifically asked for it.

`pnpm upload` stages the project on the graphics server. While it does not make the project live, it can overwrite a previously uploaded version and should not be run without confirmation.

## Typical workflow

1. Develop locally with `pnpm start`
2. Run `pnpm preview` to share a preview link for editorial sign-off
3. Run `pnpm upload` well ahead of the publish deadline — some code errors only surface during the production build
4. Run `pnpm pub` once editorial authorisation is given
