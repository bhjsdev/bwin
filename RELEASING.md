# Releasing

Publishing is triggered by pushing a git tag. A formal tag (`vX.Y.Z`) publishes to npm
under `latest`; a dev tag (`vX.Y.Z-dev.N`) publishes under `dev`.

## Steps

### 1. Open a release PR

Set the version in `package.json` — either a formal release (e.g. `0.3.2`) or a dev
release (e.g. `0.3.3-dev.0`).

### 2. Tag the release commit

Once the PR is merged, switch to `main` and create the tag against the release commit:

```bash
git checkout main && git pull
git tag v0.3.2 <commit>      # tag the release commit
```

### 3. Push the tag

Pushing the tag triggers the publish workflow:

```bash
git push origin v0.3.2
```

### 4. Done — version auto-bumps

Once publishing completes, the workflow automatically bumps `main` to the next dev
version via a self-merging PR. Nothing further to do.

## Reviewer's job

The publish workflow is gated by the **`PUBLISH`** environment, so it pauses for an
approval before anything is published to npm. Before approving, the reviewer verifies
that the pushed tag matches the content about to be published:

- The tag points at the intended commit on `main` (the merged release commit).
- The tag name matches `version` in that commit's `package.json` — e.g. tag `v0.3.2`
  ⇄ `"version": "0.3.2"`. `pnpm publish` ships whatever `package.json` says regardless
  of the tag name, so a mismatch publishes the wrong version.
- Formal vs dev is correct: a `vX.Y.Z` tag goes to `latest`, a `vX.Y.Z-dev.N` tag goes
  to `dev`.

Approve the run only when these line up; otherwise reject it, fix the tag, and re-push.
