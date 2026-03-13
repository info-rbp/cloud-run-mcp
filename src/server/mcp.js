import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { healthCheckTool } from '../tools/health/healthCheck.js';
import { writeMcpTestRecordTool } from '../tools/test/writeMcpTestRecord.js';
import { readMcpTestRecordTool } from '../tools/test/readMcpTestRecord.js';
import { env } from '../config/env.js';

const toolDefinitions = [
  {
    name: 'health_check',
    description: 'Confirms MCP server reachability and runtime metadata.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    handler: healthCheckTool,
  },
  {
    name: 'write_mcp_test_record',
    description: 'Writes a safe test record to Firestore collection mcp_test_records.',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          minLength: 1,
          description: 'Document id/key for the test record',
        },
        value: {
          type: 'string',
          minLength: 1,
          description: 'String value to save in the test record',
        },
      },
      required: ['key', 'value'],
      additionalProperties: false,
    },
    handler: writeMcpTestRecordTool,
  },
  {
    name: 'read_mcp_test_record',
    description: 'Reads a safe test record from Firestore collection mcp_test_records.',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          minLength: 1,
          description: 'Document id/key for the test record',
        },
      },
      required: ['key'],
      additionalProperties: false,
    },
    handler: readMcpTestRecordTool,
  },
];

export function createMcpServer() {
  const server = new Server(
    {
      name: env.mcpServerName,
      version: env.mcpServerVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = toolDefinitions.find(({ name }) => name === request.params.name);

    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    return tool.handler(request.params.arguments ?? {});
  });

  return server;
}
