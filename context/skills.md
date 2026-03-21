# Skills Reference

These are the Claude Code slash commands available in this project.

## Project skills

| Command          | What it does                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `/client`        | Onboard a new client — sets up project folder, configures modules, updates `context/client.md` |
| `/client-remove` | Remove a client project                                                                        |
| `/ship`          | Convention check → TypeScript build → push to production (Vercel)                              |

## Code quality

| Command     | What it does                                                                          |
| ----------- | ------------------------------------------------------------------------------------- |
| `/simplify` | Reviews recently changed code for reuse, quality, and efficiency — fixes issues found |

## Claude Code configuration

| Command             | What it does                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `/update-config`    | Edit `settings.json` — permissions, env vars, hooks (automated behaviors like "before commit, run X") |
| `/keybindings-help` | Customize keyboard shortcuts in `~/.claude/keybindings.json`                                          |

## Utility

| Command                      | What it does                                                  |
| ---------------------------- | ------------------------------------------------------------- |
| `/loop <interval> <command>` | Run a command on a recurring interval (e.g. `/loop 5m /ship`) |
| `/find-skills`               | Discover and install new skills                               |
| `/claude-api`                | Helpers for building apps with the Anthropic SDK / Claude API |

## When to use which

- **Finished a feature?** → `/ship`
- **Code feels bloated after writing?** → `/simplify`
- **Starting work for a new client?** → `/client`
- **Need something automated on a trigger?** → `/update-config` (hooks live in settings, not memory)
