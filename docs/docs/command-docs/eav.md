---
title: eav
sidebar_position: 7
---

# eav

Manage EAV attribute sets.

## eav attribute-set list

List attribute sets with paging.

```bash
mage-remote-run eav attribute-set list --page 1 --size 20
```

### Options

- `-p, --page <number>`: Page number (default: 1)
- `-s, --size <number>`: Page size (default: 20)
- `-f, --format <type>`: Output format (text, json, xml) (default: text)

## eav attribute-set show `<id>`

Show attribute set details.

```bash
mage-remote-run eav attribute-set show 4
```
