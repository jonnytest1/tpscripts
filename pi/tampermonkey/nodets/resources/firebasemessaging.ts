
import * as admin from 'firebase-admin';

class FireBAseMessaging {
    app: admin.app.App;

    constructor() {
        this.app = admin.initializeApp();

    }

    async sendTestNotification(token) {

        //const token = '';
        return this.app.messaging()
            .sendToDevice(token, {
                data: {
                    message: 'est'
                },
                notification: {
                    body: 'test'
                }
            });
    }

}

export const firebasemessageing = new FireBAseMessaging();