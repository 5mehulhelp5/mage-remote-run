---
title: customer
sidebar_position: 6
---

# Customer Commands

Manage customers.

## customer list

List customers with paging controls.

```bash
mage-remote-run customer list --page 1 --size 20
```

### Options
- `-p, --page <number>`: Page number (default: 1)
- `-s, --size <number>`: Page size (default: 20)
- `-f, --format <type>`: Output format (text, json, xml) (default: text)

### `customer group`

Commands for managing customer groups.

```bash
# List all customer groups
mage-remote-run customer group list --page 1 --size 20
```

## customer search `<query>`

Search customers by email (LIKE match).

```bash
mage-remote-run customer search example.com
```

## customer show `<customerId>`

Show a customer with selectable output format.

```bash
mage-remote-run customer show 42
mage-remote-run customer show 42 --format json
```

Options:

- `-f, --format <type>`: `text`, `json`, or `xml`

## customer edit `<id>`

Interactively edit basic customer fields.

```bash
mage-remote-run customer edit 42
```

## customer delete `<customerId>`

Delete a customer (prompts for confirmation unless forced).

```bash
mage-remote-run customer delete 42
mage-remote-run customer delete 42 --force
```

Options:

- `--force`: Skip confirmation prompt

## customer confirm [customerId]

Resend a customer confirmation email. If no customer ID is provided, the CLI prompts for email and website ID.

```bash
mage-remote-run customer confirm 42
mage-remote-run customer confirm --redirect-url https://store.example.com/confirm
```

Options:

- `--redirect-url <url>`: URL to redirect after confirmation
