import { createApp } from './server/app.js';
import { env } from './config/env.js';

export function startServer() {
  const app = createApp();
  app.listen(env.port, env.host, () => {
    console.log(`Remote Business Partner MCP server listening on ${env.host}:${env.port}`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
