---
title: tax
sidebar_position: 9
---

# tax

Manage tax classes.

## tax class list

List tax classes with paging.

```bash
mage-remote-run tax class list --page 1 --size 20
```

### Options

- `-p, --page <number>`: Page number (default: 1)
- `-s, --size <number>`: Page size (default: 20)
- `-f, --format <type>`: Output format (text, json, xml) (default: text)

## tax class show `<id>`

Show tax class details.

```bash
mage-remote-run tax class show 2
```
