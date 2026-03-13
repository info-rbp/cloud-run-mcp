import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

// Creates a per-request transport instance for stateless streamable HTTP requests.
export function createTransport() {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
}
