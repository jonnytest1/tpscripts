import { load, queries, save } from 'hibernatets';
import { GET, HttpRequest, HttpResponse, Path, POST, PUT } from '../express-wrapper';
import { BatteryLevel } from '../models/battery';
import { Connection } from '../models/connection';
import { Receiver } from '../models/receiver';
import { Sender } from '../models/sender';
import { logKibana } from '../util/log';
import { assign } from '../util/settable';

@Path('sender')
export class SenderResource {

    @POST({
        path: 'trigger'
    })
    async trigger(req: HttpRequest, res: HttpResponse) {
        const sender = await load(Sender, s => s.deviceKey = req.body.deviceKey);
        if (!sender[0]) {
            res.status(404)
                .send();
            return;
        }
        sender[0].batteryEntries.push(new BatteryLevel(req.body.a_read1, req.body.a_read2, req.body.a_read3));
        try {
            await Promise.all(sender[0].connections.map(connection => connection.execute(req.body)));
        } catch (e) {
            logKibana('ERROR', 'error in trigger', e);
        }
        res.send();
    }

    @POST({ path: 'test' })
    async test(req, res) {
        if (!req.body.devid) {
            return res.status(400).send();
        }
        const sender = await load(Sender, s => s.deviceKey = req.body.devid, [], { first: true, deep: true });
        if (!sender) {
            res.status(404)
                .send();
            return;
        }
        const transforms = await Promise.all(sender.connections.map(connection => connection.transform(req.body)));
        res.send(transforms);
    }

    @POST({ path: '' })
    async register(req, res) {
        if (!req.body.deviceKey) {
            res.status(400)
                .send('missing deviceKey');
            return;
        }
        let existingSender = await load(Sender, s => s.deviceKey = req.body.deviceKey);
        if (existingSender[0]) {
            res.status(409)
                .send('sender already exists');
            return;
        }
        const sender = new Sender();
        assign(sender, req.body);
        await save(sender);
        res.send(sender);
    }

    @PUT({ path: '' })
    async update(req, res) {
        const sender = await load(Sender, s => s.deviceKey = req.body.itemRef);
        if (!sender[0]) {
            return res.status(404).send();

        }
        assign(sender[0], req.body);
        await queries(sender[0]);
        res.send(sender[0]);
    }

    @GET({
        path: ''
    })
    async getSenders(req, res: HttpResponse) {
        const senders = await load(Sender, 'true = true', undefined, { deep: true });
        res.send(senders);
    }
}