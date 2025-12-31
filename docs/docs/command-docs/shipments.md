---
title: shipment
sidebar_position: 11
---

# Shipment Commands

Manage shipments.

## shipment list

List shipments.

```bash
mage-remote-run shipment list --page 1 --size 20
```

### Options

- `-p, --page <number>`: Page number (default: 1)
- `-s, --size <number>`: Page size (default: 20)
- `-f, --format <type>`: Output format (text, json, xml) (default: text)
- `--order-id <id>`: Filter by Order ID

## shipment show `<id>`

Show shipment details.

```bash
mage-remote-run shipment show 123
```

### Options

- `-f, --format <type>`: Output format (text, json, xml) (default: text)

## shipment create `<orderId>`

Create a shipment for an order.

```bash
mage-remote-run shipment create 123 --notify
mage-remote-run shipment create 123 --tracks '[{"carrier_code":"fedex","title":"FedEx","track_number":"123456"}]'
```

### Options

- `--notify`: Notify customer via email
- `--append-comment`: Append comment
- `--comment <text>`: Comment text
- `--visible`: Comment visible on frontend
- `--tracks <json>`: Tracks array JSON string
- `--items <json>`: Items array JSON string (if partial shipment)

## shipment track `<id>`

Add tracking number to shipment.

```bash
mage-remote-run shipment track 123 --carrier fedex --title FedEx --number 987654321
```

### Options

- `--carrier <code>` (required)
- `--title <title>` (required)
- `--number <number>` (required)

## shipment label `<id>`

Retrieve shipping label.

```bash
mage-remote-run shipment label 123
```

## shipment email `<id>`

Send shipment email.

```bash
mage-remote-run shipment email 123
```

## shipment comments `<id>`

Add comment to shipment.

```bash
mage-remote-run shipment comments 123 --comment "Shipped via FedEx" --notify
```

### Options

- `--comment <text>` (required)
- `--visible`: Visible on frontend
- `--notify`: Notify customer
