import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { createMcpServer } from './mcp.js';
import { createTransport } from './transport.js';

export function createApp() {
  const app = createMcpExpressApp({ host: null });

  // Keep the root harmless and explicit for Cloud Run health checks.
  app.get('/', (_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  async function handleMcpRequest(req, res) {
    const transport = createTransport();
    const server = createMcpServer();

    res.on('close', () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Failed to handle /mcp request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  }

  app.post('/mcp', handleMcpRequest);

  app.get('/mcp', (_req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    });
  });

  return app;
}
