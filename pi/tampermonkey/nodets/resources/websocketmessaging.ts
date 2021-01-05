import { client as WebSocketClient } from 'websocket';
import { WS } from '../express-wrapper';
import { Websocket } from '../express-ws-type';
@WS({
    path: 'ws'
})
class WebsocketMessaging {

    private static connections = {};

    websocket: Websocket;

    client: WebSocketClient;
    constructor() {

    }

    sendWebsocket(ip, data): number {
        console.log('sending websocket connection');
        this.client = new WebSocketClient();
        this.client.on('connect', (connection) => {
            console.log('Connection successful');
            connection.on('error', function (error) {
                console.log('Connection Error: ' + error.toString());
            });
            connection.on('close', (...args) => {
                console.log('Connection Closed');

            });
            connection.on('message', (data) => {
                console.log(`received response '${data.utf8Data}'`);
            });
        });
        this.client.on('connectFailed', () => {
            console.log('connection failed');
        });
        const connectionUrl = new URL(`ws://${ip}`);
        connectionUrl.searchParams.append('data', JSON.stringify(data));
        this.client.connect(connectionUrl.href, 'echo-protocol');
        return 0;
    }

    send(deviceKey: string, data: any) {
        const websocket = WebsocketMessaging.connections[deviceKey];
        if (!websocket) {
            console.log(`no webscoket for ${deviceKey}`);
        } else {
            try {
                websocket.send(JSON.stringify(data));
            } catch (e) {
                console.error(e);
            }
        }
    }

    static onConnected(key: string, ws) {
        this.connections[key] = ws;
        console.log(`added connection for ${key}`);
    }

}

export default new WebsocketMessaging();