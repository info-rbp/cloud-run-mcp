import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { createServer } from './mcp.js';
import { createTransport } from './transport.js';

export function createApp() {
  const app = createMcpExpressApp({ host: null });

  // Keep the root harmless and explicit for Cloud Run health checks.
  app.get('/', (_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.post('/mcp', async (req, res) => {
    const server = createServer();
    const transport = createTransport();

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
    } finally {
      res.on('close', () => {
        transport.close();
        server.close();
      });
    }
  });

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
