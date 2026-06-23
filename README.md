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

Validated available OpenCode Go models currently used by this repository:

- `opencode-go/kimi-k2.7-code`
- `opencode-go/deepseek-v4-pro`
- `opencode-go/deepseek-v4-flash`

If you override the workflow variables, use model IDs returned by `https://opencode.ai/zen/go/v1/models`.

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
- The workflows install OpenCode with `npm install -g opencode-ai@latest` and run `opencode github run` directly.
- The planning workflow is comment-driven only and runs on `/opencode` or `/opencode plan` comments.
- The implementation workflow is comment-driven only and runs on `/opencode implement` comments.
- The implementation workflow updates the pull request with a screenshot captured from the generated change.

## GitHub Actions Permissions

The implementation workflow requires these permissions:

- `contents: write`
- `pull-requests: write`
- `issues: write`
