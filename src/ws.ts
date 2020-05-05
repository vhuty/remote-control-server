import WebSocket from 'ws';
import HTTP from 'http';

import config from './config';

const attach = (server: HTTP.Server, parser: any) => {
  /* Pool of connections */
  const __pool: Map<string, Connection> = new Map();

  const wss = new WebSocket.Server({ noServer: true });
  wss.on('connection', __init);

  server.on('upgrade', (req, socket, head) => {
    parser(req, {}, () => {
      const { token } = req.session;

      if (!token) {
        /* No access token presented */
        socket.destroy();

        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', { ws, token });
      });
    });
  });

  function __init(connection: Connection) {
    const { token, ws } = connection;

    __pool.set(token.source, connection);

    /* Notify of status changing */
    multicast(token, {
      source: token.source,
      status: Status.ONLINE,
    });

    const {
      ws: { heartbeat, latency },
    } = config;

    /* 
      Heartbeat mechanism to prevent 
      premature disconnecting by environment
    */
    const interval = setInterval(() => {
      ws.ping();
    }, heartbeat + latency);

    /* WebSocket event handlers */
    ws.on('message', (message: string) => {
      const data: Message = JSON.parse(message);

      if (data.target) {
        /* Message having a specified recipient */
        const connection = __pool.get(data.target);

        if (connection) {
          connection.ws.send(message, (err) => {
            if (err) {
              console.error('[WS_ERROR]: ', err);
            }
          });
        }

        return;
      }

      /* Message to anyone related */
      multicast(token, data);
    });

    ws.on('close', (code, reason) => {
      console.log(
        `[WS_CLOSE]: source: ${token.source}, code: ${code}, reason: ${reason}`
      );

      __pool.delete(token.source);
      clearInterval(interval);

      if (code !== Codes.UPDATE_CREDENTIALS) {
        /* Notify of status changing */
        multicast(token, {
          source: token.source,
          status: Status.OFFLINE,
        });
      }
    });

    //TODO: implement error logging
    ws.on('error', (err) => {
      console.error(`[WS_ERROR]: `, err);
    });
  }

  function multicast(token: Token, message: Message) {
    for (const connection of __pool.values()) {
      const {
        ws,
        token: { source, targets },
      } = connection;

      if (
        (token.targets && token.targets.includes(source)) ||
        (targets && targets.includes(token.source))
      ) {
        const data = JSON.stringify(message);
        ws.send(data, (err) => {
          if (err) {
            console.error('[WS_ERROR]: ', err);
          }
        });
      }
    }
  }
};

type Connection = {
  ws: WebSocket;
  token: Token;
};

type Token = {
  source: string;
  targets?: string[];
};

type Message = {
  source: string;
  target?: string;
  status?: string;
  data?: string;
};

enum Status {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

enum Codes {
  UPDATE_CREDENTIALS = 4001,
}

export default {
  attach,
};
