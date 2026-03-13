import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { writeMcpTestRecordSchema, readMcpTestRecordSchema } from '../schemas/test.js';
import { healthCheckTool } from '../tools/health/healthCheck.js';
import { writeMcpTestRecordTool } from '../tools/test/writeMcpTestRecord.js';
import { readMcpTestRecordTool } from '../tools/test/readMcpTestRecord.js';
import { env } from '../config/env.js';

export function createServer() {
  const server = new McpServer({
    name: env.mcpServerName,
    version: env.mcpServerVersion,
  });

  // Baseline, safe tools for Cloud Run-hosted MCP integration.
  server.registerTool(
    'health_check',
    {
      description: 'Confirms MCP server reachability and runtime metadata.',
      inputSchema: {},
    },
    healthCheckTool
  );

  server.registerTool(
    'write_mcp_test_record',
    {
      description: 'Writes a safe test record to Firestore collection mcp_test_records.',
      inputSchema: writeMcpTestRecordSchema,
    },
    writeMcpTestRecordTool
  );

  server.registerTool(
    'read_mcp_test_record',
    {
      description: 'Reads a safe test record from Firestore collection mcp_test_records.',
      inputSchema: readMcpTestRecordSchema,
    },
    readMcpTestRecordTool
  );

  return server;
}
