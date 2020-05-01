const WebSocket = require('ws');

module.exports.attach = (server, __parser) => {
    //Pool of channels (objects that contains source instance and target instances)
    const __pool = new Map();

    server.on('upgrade', __toWS);

    const wss = new WebSocket.Server({ noServer: true });
    wss.on('connection', __init);

    /**
     *
     * @param {*} req Request incoming message
     * @param {*} socket Duplex stream
     * @param {*} head Buffer
     */
    function __toWS(req, socket, head) {
        wss.handleUpgrade(req, socket, head, (ws) => {
            __parser(req, {}, (_) => {
                const { token } = req.session;

                if (!token) {
                    socket.destroy();

                    return;
                }

                const hasTarget = token.hasOwnProperty('targetId');

                wss.emit('connection', { ws, token, hasTarget });
            });
        });
    }

    /**
     *
     * @param {Object} connection A incoming request connection object
     */
    function __init(connection) {
        const { ws, token, hasTarget } = connection;

        if (hasTarget) {
            initTarget(ws, token);
        } else {
            initSource(ws, token);
        }

        //TODO: realize error logging
        ws.on('error', (err) => {
            console.error(`[WSERROR]: `, err);
        });
    }

    /**
     *
     * @param {WebSocket} socket Source entity connection (Desktop device)
     * @param {Object} token An authorization object
     */
    function initSource(socket, token) {
        const { sourceId, targetId } = token;

        const channel = {
            device: socket,
            controllers: new Map(),
        };

        __pool.set(sourceId, channel);

        //Initialize handlers

        socket.on('message', (data) => {
            const channel = __pool.get(sourceId);

            if (channel) {
                //Requesting entity - desktop device

                const { controllers } = channel;

                for (const controller of controllers.values()) {
                    controller.send(data, (err) => {
                        if (err) {
                            console.error('[WSERROR]: ', err);
                        }
                    });
                }
            }
        });

        socket.on('close', (code, reason) => {
            console.log(
                `[WSCLOSE]: sourceId: ${sourceId}, targetId: ${targetId}, code: ${code}, reason: ${reason}`
            );

            const channel = __pool.get(sourceId);
            if (channel) {
                //Requesting entity - desktop device

                const { controllers } = channel;

                for (const controller of controllers.values()) {
                    controller.close(1001, 'Device is currently offline');
                }

                __pool.delete(sourceId);
            }
        });
    }

    /**
     *
     * @param {WebSocket} socket Target entity connection (Mobile device)
     * @param {Object} token An authorization object
     */
    function initTarget(socket, token) {
        const { sourceId, targetId } = token;

        const channel = __pool.get(targetId);
        if (!channel) {
            return socket.close(4004, 'Target not found');
        }

        const { device, controllers } = channel;

        controllers.set(sourceId, socket);

        //Ping message
        device.emit('connection', {
            id: sourceId,
        });

        //Initialize handlers
        socket.on('message', (data) => {
            const channel = __pool.get(targetId);
            if (channel) {
                //Requesting entity - mobile device

                const { device } = channel;

                device.send(data, (err) => {
                    if (err) {
                        console.error('[WSERROR]: ', err);
                    }
                });
            }
        });

        socket.on('close', (code, reason) => {
            console.log(
                `[WSCLOSE]: sourceId: ${sourceId}, targetId: ${targetId}, code: ${code}, reason: ${reason}`
            );

            const channel = __pool.get(targetId);
            if (channel) {
                //Requesting entity - mobile device

                const { controllers } = channel;

                controllers.delete(sourceId);

                return;
            }
        });
    }
};
