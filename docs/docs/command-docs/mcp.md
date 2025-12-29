---
title: mcp
sidebar_position: 13
---

# MCP Server

Expose mage-remote-run commands as tools over the Model Context Protocol (MCP).

## Usage

Start with stdio transport (default):

```bash
mage-remote-run mcp --transport stdio
```

Start with HTTP transport (SSE):

```bash
mage-remote-run mcp --transport http --host 127.0.0.1 --port 18098
```

## Options

- `--transport <type>`: `stdio` or `http` (default: `stdio`)
- `--host <host>`: HTTP host (default: `127.0.0.1`)
- `--port <port>`: HTTP port (default: `18098`)

## Tool naming

Tools are derived from CLI commands by replacing spaces with underscores. Examples:

- `website list` -> `website_list`
- `store view list` -> `store_view_list`

Arguments and options map to the same CLI inputs (`format`, IDs, flags, and so on).

## Notes

- The MCP server uses your local profiles. Create one with `mage-remote-run connection add` first.
- HTTP transport exposes `GET /sse` and `POST /messages`.
