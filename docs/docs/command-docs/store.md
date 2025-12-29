---
title: store
sidebar_position: 12
---

# Store Commands

Manage store groups, views, and configurations.

## Store Groups

Manage store groups.

### List Store Groups

```bash
mage-remote-run store group list [options]
```

**Options:**

| Option | Description | Default |
|---|---|---|
| `-f, --format <type>` | Output format (`text`, `json`, `xml`) | `text` |

### Other Commands

- `store group search <query>`: Search store groups by name or code.
- `store group delete <id>`: Delete a store group.
- `store group edit <id>`: Edit a store group.

## Store Views

Manage store views.

### List Store Views

```bash
mage-remote-run store view list [options]
```

**Options:**

| Option | Description | Default |
|---|---|---|
| `-f, --format <type>` | Output format (`text`, `json`, `xml`) | `text` |

### Other Commands

- `store view search <query>`: Search store views by name or code.
- `store view delete <id>`: Delete a store view.
- `store view edit <id>`: Edit a store view.

## Store Configuration

### List Store Configs

List store configuration details including currencies and locales.

```bash
mage-remote-run store config list
```
