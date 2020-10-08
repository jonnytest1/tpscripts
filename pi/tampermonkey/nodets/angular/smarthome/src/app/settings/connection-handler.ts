import { CanvasUtil } from '../utils/context';
import { ConnectionBottomsheetComponent } from './connection-bottomsheet/connection-bottomsheet.component';
import { Receiver, Sender } from './sender';
import { SenderBottomSheetComponent } from './sender-bottom-sheet/sender-bottom-sheet.component';

export class ConnectionHandler {


    addingSender: Sender;

    activeSender: Sender;
    util: CanvasUtil;

    constructor(private senders: Array<Sender>, private receivers: Array<Receiver>, private snackOpen: (data, type) => any) {

    }

    randomize() {
        for (let i = 0; i < 5; i++) {
            this.senders.push({
                id: `${i}`,
                description: 'sdfsgsdhg sd sdg sd hgdsfh sd jfj sf jftj fsj fj fg jhfg jfgj fuj rjsdrtjudrtj  yrzh dfh ',
                name: `sender${i}`
            });
        }

        for (let i = 0; i < 3; i++) {
            this.receivers.push({
                id: `${i}`,
                description: 'sdfsgsdhg asgsd gae rha glas jgoiasjgh oöiaj öoirja göoieaj rgöoie ajoiejraoijreaoiö eiprjioe gjidrgöp',
                name: `receiver${i}`
            });
        }
        let conId = 1;
        this.senders.forEach(sender => {
            this.receivers.forEach(receiver => {
                if (Math.random() > 0.4) {
                    if (!sender.connections) {
                        sender.connections = [];
                    }
                    sender.connections.push({
                        id: `${conId++}`,
                        receiver: receiver
                    });
                }
            });
        });
    }

    setCanvas(nativeCanvas: HTMLCanvasElement) {
        const height = getComputedStyle(nativeCanvas.parentElement).height;
        nativeCanvas.height = +height.replace('px', '');
        this.util = new CanvasUtil(nativeCanvas);
    }

    setAcvtiveSender(sender: Sender) {
        if (sender != this.activeSender) {
            this.activeSender = sender;
            this.drawConnections();
        }
    }

    drawConnections() {
        const nativeCanvas = this.util.canvas;

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
                .find(con => con.receiver.id === receiver.attributes.getNamedItem('item').value);
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
            if (sender.attributes.getNamedItem('item').value === this.activeSender.id) {
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

    addConnection(item: Receiver): boolean {
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
                return false;
            }

            this.addingSender.connections.push({
                receiver: item,
                id: `${highestId + 1}`
            });
            this.addingSender = undefined;
            return true;
        }
        this.addingSender = undefined;
        return false;

    }


    reset() {
        this.addingSender = undefined;
    }

}
