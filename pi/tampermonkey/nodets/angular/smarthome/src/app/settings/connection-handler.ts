
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { CanvasUtil } from '../utils/context';
import { ConnectionBottomsheetComponent } from './connection-bottomsheet/connection-bottomsheet.component';
import { Connection, Receiver, Sender } from './interfaces';
import { SenderBottomSheetComponent } from './sender-bottom-sheet/sender-bottom-sheet.component';

export class ConnectionHandler {


    addingSender: Sender;

    activeSender: Sender;
    util: CanvasUtil;

    constructor(private senders: Array<Sender>,
        private receivers: Array<Receiver>,
        private snackOpen: (data, type) => any) {

    }

    randomize() {
        /* for (let i = 0; i < 5; i++) {
             this.senders.push({
                 id: 400 + i,
                 description: 'sdfsgsdhg sd sdg sd hgdsfh sd jfj sf jftj fsj fj fg jhfg jfgj fuj rjsdrtjudrtj  yrzh dfh ',
                 name: `sender${i}`,
                 connections: []
             });
         }*/

        /* for (let i = 0; i < 3; i++) {
             this.receivers.push({
                 id: `${200 + i}`,
                 description: 'sdfsgsdhg asgsd gae rha glas jgoiasjgh oöiaj öoirja göoieaj rgöoie ajoiejraoijreaoiö eiprjioe gjidrgöp',
                 name: `receiver${i}`
             });
         }*/
        const conId = 200;
        this.senders.forEach(sender => {
            /*this.receivers.forEach(receiver => {
                if (Math.random() > 0.4) {
                    if (!sender.connections) {
                        sender.connections = [];
                    }
                    sender.connections.push({
                        id: conId++,
                        receiver: receiver
                    });
                }
            });*/
        });
    }

    setCanvas(nativeCanvas: HTMLCanvasElement) {
        this.util = new CanvasUtil(nativeCanvas);
    }

    setAcvtiveSender(sender: Sender) {
        if (sender !== this.activeSender) {
            this.activeSender = sender;
            this.drawConnections();
        }
    }

    drawConnections() {
        const nativeCanvas = this.util.canvas;

        const height = getComputedStyle(nativeCanvas.parentElement).height;
        nativeCanvas.height = +height.replace('px', '');

        const width = nativeCanvas.width;
        this.util.reset();

        if (!this.activeSender.connections) {
            return;
        }
        const senders: NodeListOf<HTMLElement> = nativeCanvas.parentElement.parentElement.querySelectorAll('.sender');
        const receivers: NodeListOf<HTMLElement> = nativeCanvas.parentElement.parentElement.querySelectorAll('.receiver');
        let startY;
        let endY;

        const offsetMod = -26;
        receivers.forEach(receiver => {
            const connection = this.activeSender.connections
                .find(con => `${con.receiver.id}` === receiver.attributes.getNamedItem('item').value);
            if (connection) {
                const top = receiver.offsetTop + offsetMod;
                const heightForSender = Math.floor((top + (top + receiver.offsetHeight)) / 2);

                if (!startY || heightForSender < startY) {
                    startY = heightForSender;
                }
                if (!endY || heightForSender > endY) {
                    endY = heightForSender;
                }

                this.util.line({
                    from: { x: 'center', y: heightForSender },
                    to: { x: this.util.width - 12, y: heightForSender },
                    click: (event: MouseEvent) => {
                        this.snackOpen(connection, ConnectionBottomsheetComponent);
                        event.stopPropagation();
                    }
                });
            }
        });

        senders.forEach(sender => {
            if (sender.attributes.getNamedItem('item').value === `${this.activeSender.id}`) {
                const top = sender.offsetTop + offsetMod;
                const heightForSender = Math.floor((top + (top + sender.offsetHeight)) / 2);
                if (!startY || heightForSender < startY) {
                    startY = heightForSender;
                }
                if (!endY || heightForSender > endY) {
                    endY = heightForSender;
                }
                this.util.line({
                    from: { x: 12, y: heightForSender },
                    to: { x: 'center', y: heightForSender }
                });
            }
        });

        this.util.line({
            from: { x: 'center', y: startY },
            to: { x: 'center', y: endY }
        });
    }

    startAdd(sender: Sender) {
        this.addingSender = sender;
        if (this.activeSender !== sender) {
            this.activeSender = sender;
            this.drawConnections();
        }
    }

    addConnection(item: Receiver): Connection {
        if (this.addingSender) {
            if (!this.addingSender.connections) {
                this.addingSender.connections = [];
            }
            let highestId = -1;
            if (this.addingSender.connections.some(c => {
                if (highestId < +c.id) {
                    highestId = +c.id;
                }
                return c.receiver.id === item.id;
            })) {
                this.addingSender = undefined;
                return null;
            }
            const newConnection: Connection = {
                receiver: item,
                id: highestId + 10
            };
            this.addingSender.connections.push(newConnection);
            fetch(environment.prefixPath + 'rest/connection', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: this.addingSender.deviceKey,
                    receiverId: item.id
                })
            })
                .then(r => r.json())
                .then((connection: Connection) => {
                    newConnection.id = connection.id;
                });
            this.addingSender = undefined;
            return newConnection;
        }
        this.addingSender = undefined;
        return null;

    }


    reset() {
        this.addingSender = undefined;
    }

}
