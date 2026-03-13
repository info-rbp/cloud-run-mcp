import { env } from '../../config/env.js';
import { baselineServerMetadata } from '../../schemas/common.js';
import { jsonToolResponse } from '../../utils/responses.js';

export async function healthCheckTool() {
  return jsonToolResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: {
      name: env.mcpServerName,
      version: env.mcpServerVersion,
    },
    ...baselineServerMetadata,
  });
}
