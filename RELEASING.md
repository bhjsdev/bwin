# Releasing

Publishing is triggered manually via the **Publish to npm** workflow
(`workflow_dispatch`). It reads the version from `package.json`: `X.Y.Z` publishes
under `latest`, `X.Y.Z-dev.N` under `dev`. The workflow creates and pushes the matching
`vX.Y.Z` git tag itself — don't tag by hand.

To cut a quick dev build of in-progress branch work, tick the **dev_release** checkbox
when dispatching — see [Ungated dev release](#ungated-dev-release) below.

## Steps

1. **Bump the version** in `package.json` via a PR. Either edit it manually, or run an
   `npm version` command with `--no-git-tag-version` (the flag updates `package.json`
   without committing or tagging — the workflow handles the tag):
   - Formal release — use `patch` for fixes, `minor` for backward-compatible features,
     `major` for breaking changes (e.g. a patch bump `0.4.1` → `0.4.2`):

     ```sh
     npm version patch --no-git-tag-version
     # or pin it explicitly:
     npm version 0.4.2 --no-git-tag-version
     ```

   - Dev prerelease (e.g. `0.4.2-dev.0` → `0.4.2-dev.1`):

     ```sh
     npm version prerelease --preid=dev --no-git-tag-version
     ```

2. **Merge the PR** into `main`.
3. **Run the workflow** — _Publish to npm_ in the Actions tab, or
   `gh workflow run publish.yml`. It pauses on the `PUBLISH` environment for approval,
   then verifies the tag doesn't exist, builds, publishes, pushes the tag, and (for
   formal releases only) generates release notes.

## Ungated dev release

To publish a `dev`-tagged build straight from a feature branch without the `PUBLISH`
approval gate:

1. Actions → **Publish to npm** → **Run workflow**.
2. In the branch dropdown, pick the branch to publish from.
3. Tick **dev_release**, then run.

This runs the `manual-dev-publish` job: it computes an ephemeral
`<next-patch>-dev-<short-sha>` version from the branch's `package.json` (no
`package.json` edit or version bump needed), builds, and publishes under the `dev`
tag. It does **not** pause on the `PUBLISH` environment, push a git tag, or create
release notes. With the box unchecked, dispatch behaves exactly as the formal release
above.

## Reviewer's job

The `PUBLISH` environment gates the run for approval. Before approving, confirm:

- `main` is at the intended commit and its `package.json` `version` is correct —
  `pnpm publish` ships whatever `package.json` says.
- That version's tag doesn't already exist (the workflow also checks this).
- Formal vs dev is right: `X.Y.Z` → `latest`, `X.Y.Z-dev.N` → `dev`.

Otherwise reject, fix the version in `package.json`, and re-run.
