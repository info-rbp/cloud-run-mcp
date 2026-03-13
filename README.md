# Remote Business Partner MCP Service (Cloud Run)

This repository hosts a **standalone MCP server** intended to be the long-term integration layer between ChatGPT and the Remote Business Partner application.

Current architecture:

`ChatGPT -> MCP server on Cloud Run -> Firestore (today) -> Internal app APIs (future)`

## What is implemented now

The MCP endpoint is `POST /mcp` (streamable HTTP transport) and currently exposes only safe baseline tools:

1. `health_check`
2. `write_mcp_test_record`
3. `read_mcp_test_record`

The read/write tools use Firestore collection `mcp_test_records`.

## Planned tool domains (scaffolded, not exposed yet)

- documents
- members
- support
- admin

## Project structure

```text
src/
  index.js
  server/
    app.js
    mcp.js
    transport.js
  tools/
    health/healthCheck.js
    test/
      writeMcpTestRecord.js
      readMcpTestRecord.js
    documents/index.js
    members/index.js
    support/index.js
    admin/index.js
  services/
    firestore/
      client.js
      mcpTestRecords.js
    appApi/client.js
  schemas/
    common.js
    test.js
  config/env.js
  utils/
    responses.js
    errors.js
```

## Local run

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set `FIREBASE_PROJECT_ID`.

3. Start server:

```bash
npm start
```

Server binds to `0.0.0.0:$PORT` (default `8080`).

## Deploy to Cloud Run

From repo root:

```bash
gcloud run deploy remote-business-partner-mcp \
  --source . \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
```

Notes:
- Cloud Run service account credentials are used automatically by Firebase Admin.
- Endpoint remains `/mcp`.

## Quick MCP checks with curl

Set URL:

```bash
export MCP_URL="https://YOUR_SERVICE_URL/mcp"
```

### 1) initialize

```bash
curl -sS "$MCP_URL" \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":"init-1",
    "method":"initialize",
    "params":{
      "protocolVersion":"2025-03-26",
      "capabilities":{},
      "clientInfo":{"name":"curl","version":"1.0.0"}
    }
  }'
```

### 2) list tools

```bash
curl -sS "$MCP_URL" \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":"tools-1","method":"tools/list","params":{}}'
```

### 3) write test record

```bash
curl -sS "$MCP_URL" \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":"write-1",
    "method":"tools/call",
    "params":{
      "name":"write_mcp_test_record",
      "arguments":{"key":"demo-key","value":"hello"}
    }
  }'
```

### 4) read test record

```bash
curl -sS "$MCP_URL" \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":"read-1",
    "method":"tools/call",
    "params":{
      "name":"read_mcp_test_record",
      "arguments":{"key":"demo-key"}
    }
  }'
```

## Using from ChatGPT after deployment

1. Add your Cloud Run MCP URL in your MCP client/server configuration as a **remote streamable HTTP** MCP server.
2. Confirm connection with `health_check`.
3. Use `write_mcp_test_record` and `read_mcp_test_record` to verify Firestore access.
4. Keep these tools as a safe smoke-test baseline while future business tools are added by domain.
