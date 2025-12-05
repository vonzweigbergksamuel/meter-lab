import { RPCLink } from '@orpc/client/websocket';
import { createORPCClient } from '@orpc/client';
import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';
import type { SocketRouterClient } from '@meter-lab/orpc';
import { browser } from '$app/environment';


let wsClient: SocketRouterClient | undefined

if (browser) {
  console.log("WS url: ", PUBLIC_WEBSOCKET_URL)

  const websocket = new WebSocket(PUBLIC_WEBSOCKET_URL);

  // TODO Remove
  websocket.addEventListener('open', () => {
    console.log('WS OPEN ✅', websocket.readyState); // 1
  });

  websocket.addEventListener('error', (err) => {
    console.error('WS ERROR ❌', err);
  });

  websocket.addEventListener('close', () => {
    console.log('WS CLOSED ⛔');
  });

  const link = new RPCLink({ websocket });

  // Type assertion to satisfy the expected type for wsClient
  wsClient = createORPCClient(link) as SocketRouterClient;
}

export { wsClient }