# se.polinema.ac.id

This repository includes GitHub Actions workflows that use OpenCode with the OpenCode Go provider for issue planning and implementation.

## GitHub Setup

### Required Secrets

Set these repository secrets in GitHub Actions:

- `OPENCODE_GO_API_KEY`: your OpenCode Go API key.
- `GH_WORKFLOW_PAT`: a personal access token with `repo` (contents) and `pull_requests` write scopes, used by `update-publications.yml` and `opencode.yml` for checkout and PR creation.
- `OPENCODE_ORG_TOKEN` (optional): a GitHub token with `read:org` scope, used by the `check-auth` job to verify organization membership. If not set, authorization falls back to `.github/opencode-allowlist.txt`.

### Optional Repository Variables

Set these repository variables if you want to override the workflow defaults:

- `OPENCODE_PLAN_MODEL`: defaults to `opencode-go/kimi-k2.7-code`
- `OPENCODE_BUILD_MODEL`: defaults to `opencode-go/deepseek-v4-pro`

Validated available OpenCode Go models currently used by this repository:

- `opencode-go/kimi-k2.7-code`
- `opencode-go/deepseek-v4-pro`
- `opencode-go/deepseek-v4-flash`

If you override the workflow variables, use model IDs returned by `https://opencode.ai/zen/go/v1/models`.

## Issue Commands

Use these commands to trigger the workflows on issues and pull requests:

- `/plan`: OpenCode reads the full issue discussion and replies with an implementation plan. Also triggered automatically when a se-polinema organization member opens a new issue with a title or body starting with `/plan`.
- `/build`: OpenCode implements the approved plan, runs `npm run build` against both the production and beta base paths, captures a screenshot, and opens or updates a pull request **into `develop`**.

Notes:

- These commands work on new comments and edited comments, both on issues and pull requests.
- They also work in pull request review comments and pull request review submissions.
- `/plan` and `/build` may include extra text after the command.
- The implementation branch uses the exact pattern `opencode/issue-{number}`, created from `main`.
- Merging the `/build` PR deploys the change to beta (`https://se.polinema.ac.id/beta/`) for validation; it does **not** close the original issue, since GitHub only auto-closes issues on merges to the default branch (`main`). Promotion to production is a separate, manually opened PR from the same `opencode/issue-{number}` branch into `main`; that PR's `Closes #{number}` is what finishes the issue. See "Release Flow" below.

### PR Feedback Loop (Agentic Revision)

After OpenCode opens a pull request, reviewers can iterate on the implementation without opening a new issue:

1. A plan is created on an issue and a PR is opened via `/build`.
2. A reviewer provides feedback on the PR by commenting `/plan <feedback>` or `/build <feedback>` in a:
   - PR comment (conversation tab)
   - PR review comment (on a diff line)
   - PR review submission body
3. When `/plan <feedback>` is used on a PR, OpenCode posts a **revised plan** back on the original issue.
4. When `/build` is then used (on the issue or PR), OpenCode checks out the existing `opencode/issue-{number}` branch, applies the revisions, and pushes a new commit. The existing PR is updated automatically.

This enables an Agentic AI feedback loop where reviewers can refine the implementation iteratively within the same issue and PR.

## Approval Rule

Only authorized members can trigger `/plan` and `/build`. Authorization is checked in two ways:

1. **Authenticated API check**: queries `https://api.github.com/orgs/se-polinema/members/{actor}` using `OPENCODE_ORG_TOKEN` (a token with `read:org` scope). If the token is not configured, this check is skipped.
2. **Fallback allowlist**: checks `.github/opencode-allowlist.txt` in this repository. Add one GitHub username per line to grant access without requiring org membership visibility.

If either check passes, the user is authorized.

## Workflow Notes

- OpenCode provider usage is restricted to `opencode-go` through `opencode.json`.
- Both commands are handled by a single workflow (`.github/workflows/opencode.yml`) with two jobs (`plan` and `build`), reducing skipped-run noise in the Actions tab.
- The `plan` job runs on `/plan` comments and does not edit files or create branches.
- The `build` job runs on `/build` comments and updates the pull request with a screenshot captured from the generated change.

## GitHub Actions Permissions

The implementation workflow requires these permissions:

- `contents: write`
- `pull-requests: write`
- `issues: write`

## Release Flow

The site deploys two environments from one GitHub Pages site (`.github/workflows/deploy.yml`):

- **Production**: builds from `main`, served at the site root (`https://se.polinema.ac.id/`).
- **Beta**: builds from `develop`, served under `https://se.polinema.ac.id/beta/`.

Every push to either branch rebuilds both and redeploys the merged artifact, so the two environments are always in sync with their respective branch tips. A missing or broken `develop` branch never blocks the production deploy (the beta build job is non-blocking).

Rule for shipping a change:

1. Branch from `main` for a feature/fix (`feature-branch`).
2. Open a PR from `feature-branch` into `develop`. Merging deploys it to beta for validation.
3. Once validated on beta, open a second PR from the same `feature-branch` into `main`. Merging deploys it to production.

Do not merge `develop` into `main` wholesale — each change ships to production through its own PR against `main`, after being validated on beta. Both `main` and `develop` are protected branches (PRs required, no direct pushes, no force pushes).

OpenCode `/build` PRs follow this same flow automatically: the `opencode/issue-{number}` branch targets `develop` first, and promotion to `main` is the same manual step 3 above.

### Base-path convention

The beta build sets `BASE_PATH=/beta/` (read by `astro.config.mjs`); production leaves it unset and serves from `/`. Because of this, source code must never hardcode a root-absolute path (`href="/members"`, `fetch('/api/...')`, `src="/images/..."`). Use the helpers in `src/lib/paths.ts` instead:

- `withBase(path)`: prefixes a base-free path for hrefs, `src` attributes, `fetch()` calls, and redirects. Safe to call on external URLs (passes them through unchanged).
- `stripBase(pathname)`: inverse, for comparing against `window.location.pathname`.

Store paths base-free and call `withBase()` once, at the render or navigation edge.
