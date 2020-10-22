
import { column, mapping, Mappings, primary, primaryOptions, table } from 'hibernatets';
import { runInNewContext } from 'vm';
import { settable } from '../util/settable';
import { Receiver } from './receiver';

@table()
export class Connection {

    @primary()
    id: number;

    @mapping(Mappings.OneToOne, Receiver)
    receiver: Receiver;

    @settable
    @column()
    transformation: string;

    @column()
    description: string;

    constructor(receiver?: Receiver) {
        if (receiver) {
            this.receiver = receiver;
        }
    }

    async execute(data: any): Promise<void> {
        data = await this.transform(data);
        await this.receiver.send(data);
    }

    getContext(data) {
        return {
            transformation: this.transformation,
            receiver: this.receiver,
            data: data
        };
    }

    getContextKeys() {
        return Object.keys(this.getContext(null));
    }

    async transform(data: any): Promise<any> {
        if (this.transformation) {
            const context = this.getContext(data);
            const methodCall = Object.keys(context)
                .join(',');
            data = runInNewContext(`${this.transformation}`, context, {
                displayErrors: true,
            });
        }
        return data;
    }
}