---
title: console
sidebar_position: 12
---

# Console (REPL)

Start an interactive console for running CLI commands or JavaScript without retyping the binary name.

```bash
mage-remote-run console
```

Aliases:

```bash
mage-remote-run repl
```

## What you can do inside the console

- Run CLI commands directly (for example, `website list`).
- Run JavaScript with top-level `await`.
- Use `list` to see available commands.
- Use `help` to show command help.
- Use `.exit` to quit.

## Globals

These variables are available in the REPL context:

- `client`: async API client factory
- `config`: current configuration
- `chalk`: output styling
- `reload()`: reload config and commands

## Options

Enable debug logging:

```bash
mage-remote-run console --debug
```
