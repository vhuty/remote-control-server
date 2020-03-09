const WebSocket = require('ws');

const { injectCookie } = require('../middlewares');

module.exports.attach = (server, parser) => {
    const __pool = new Map();

    const wss = new WebSocket.Server({ noServer: true });

    server.on('upgrade', (req, socket, head) => {
        //njectCookie(req);

        wss.handleUpgrade(req, socket, head, (ws) => {
            
            parser(req, {}, _ => {
                if(!req.session.token) {
                    socket.destroy();
                    return;
                }

                const { token } = req.session;
                ws.token = token;

                wss.emit('connection', ws);
            });
        });
    });

    wss.on('connection', (socket) => {
        const { sourceId, targetId } = socket.token;

        onConnection();

        socket.on('message', (data) => {
            let channel = {};

            channel = __pool.get(targetId);
            if(channel) {
                const { device } = channel;
                device.emit('data', data);

                return;
            }

            channel = __pool.get(sourceId);
            if(channel) {
                const { controllers } = channel;
                [ ... controllers.values() ].forEach(controller => {
                    controller.emit('data', data);
                });

                return;
            }

            socket.close(4000, 'No target');
        });

        socket.on('data', (data) => {
            socket.send(data, (err) => {
                if(err) {
                    console.error('[ERROR]: ', err);
                }
            });
        })
        
        socket.on('close', (code, reason) => {
            console.log(`[CLOSE]: id: ${ sourceId }, code: ${ code }, reason: ${ reason }`);
            
            let channel = {};

            channel = __pool.get(targetId);
            if(channel) {
                const { controllers } = channel;
                controllers.delete(sourceId);

                return;
            }

            channel = __pool.get(sourceId);
            if(channel) {
                __pool.delete(sourceId);

                return;
            }
        });

        socket.on('error', (err) => {
            console.error(`[ERROR]: `, err);
        });

        function onConnection() {
            console.log('CONNECTED');

            if(!sourceId) {
                return socket.close(4003, 'Not authorized');
            }
    
            if(targetId) {
                const _channel = __pool.get(targetId);
                if(!_channel) {
                    return socket.close(4000, 'No target');
                }
    
                _channel.controllers.set(sourceId, socket);

                return;
            }
    
            const channel = {
                device: socket,
                controllers: new Map()
            }
    
            __pool.set(sourceId, channel);
        }
    });
}