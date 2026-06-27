# se.polinema.ac.id

This repository includes GitHub Actions workflows that use OpenCode with the OpenCode Go provider for issue planning and implementation.

## GitHub Setup

### Required Secrets

Set these repository secrets in GitHub Actions:

- `OPENCODE_GO_API_KEY`: your OpenCode Go API key.
- `GH_WORKFLOW_PAT`: a personal access token with `repo` (contents) and `pull_requests` write scopes, used by `update-publications.yml` and `opencode.yml` for checkout and PR creation.

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
- `/build`: OpenCode implements the approved plan, runs `npm run build`, captures a screenshot, and opens or updates a pull request.

Notes:

- These commands work on new comments and edited comments, both on issues and pull requests.
- They also work in pull request review comments and pull request review submissions.
- `/plan` and `/build` may include extra text after the command.
- The implementation branch uses the exact pattern `opencode/issue-{number}`.

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

Only public members of the `se-polinema` GitHub organization can trigger `/plan` and `/build`.

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
