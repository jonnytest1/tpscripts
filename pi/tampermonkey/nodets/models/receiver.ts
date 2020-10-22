import { column, mapping, primary, table } from 'hibernatets';
import { firebasemessageing } from '../resources/firebasemessaging';
import { logKibana } from '../util/log';
import { settable } from '../util/settable';

@table()
export class Receiver {

    @column()
    @settable
    deviceKey: string;

    @settable
    @column()
    firebaseToken: string;

    @settable
    transformation: string;

    @primary()
    id;

    @settable
    @column()
    description: string;

    @settable
    @column()
    name: string;

    constructor() {

    }

    async send(data: any): Promise<void> {
        const response = await firebasemessageing.sendNotification(this.firebaseToken, data);
        if (response.failureCount > 0) {
            logKibana('ERROR', 'error sending firebase to receiver');
        }
    }
}