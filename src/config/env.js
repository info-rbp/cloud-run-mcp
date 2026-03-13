const parsePort = (value) => {
  const parsed = Number.parseInt(value ?? '8080', 10);
  return Number.isNaN(parsed) ? 8080 : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort(process.env.PORT),
  host: process.env.HOST || '0.0.0.0',
  firestoreProjectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
  appApiBaseUrl: process.env.APP_API_BASE_URL || '',
  mcpServerName: process.env.MCP_SERVER_NAME || 'remote-business-partner-mcp',
  mcpServerVersion: process.env.MCP_SERVER_VERSION || '0.1.0',
};
