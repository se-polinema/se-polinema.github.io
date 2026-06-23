# se-polinema.github.io

This repository includes GitHub Actions workflows that use OpenCode with the OpenCode Go provider for issue planning and implementation.

## GitHub Setup

### Required Secret

Set this repository secret in GitHub Actions:

- `OPENCODE_GO_API_KEY`: your OpenCode Go API key.

### Optional Repository Variables

Set these repository variables if you want to override the workflow defaults:

- `OPENCODE_PLAN_MODEL`: defaults to `opencode-go/kimi-k2.7-code`
- `OPENCODE_BUILD_MODEL`: defaults to `opencode-go/deepseek-v4-pro`

## Issue Commands

Use these issue comments to trigger the workflows:

- `/opencode` or `/opencode plan`: OpenCode reads the full issue discussion and replies with an implementation plan.
- `/opencode implement`: OpenCode implements the approved plan, runs `npm run build`, captures a screenshot, and opens or updates a pull request.

Notes:

- These commands work on new comments and edited comments.
- `/opencode plan` and `/opencode implement` may include extra text after the command.

## Approval Rule

Only `dhanifudin` can trigger `/opencode implement`.

## Workflow Notes

- OpenCode provider usage is restricted to `opencode-go` through `opencode.json`.
- The planning workflow is comment-driven only and runs on exact `/opencode plan`.
- The implementation workflow is comment-driven only and runs on exact `/opencode implement`.
- The implementation workflow updates the pull request with a screenshot captured from the generated change.

## GitHub Actions Permissions

The OpenCode workflows require these permissions:

- `id-token: write`
- `contents: write`
- `pull-requests: write`
- `issues: write`
