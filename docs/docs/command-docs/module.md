---
title: module
sidebar_position: 19
---

# Module Commands

:::info
These commands are not available in **Adobe Commerce as a Cloud Service** connection profiles.
:::

Manage Magento modules.

## module list

List all modules.

```bash
mage-remote-run module list
```

### Options

- `-f, --format <type>`: Output format (text, json, xml). Default: text.

```bash
mage-remote-run module list --format json
```
```bash
mage-remote-run module list --format xml
```
