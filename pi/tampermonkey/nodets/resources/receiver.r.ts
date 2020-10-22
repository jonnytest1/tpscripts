import { load, save } from 'hibernatets';
import { GET, HttpRequest, HttpResponse, Path, POST } from '../express-wrapper';
import { Receiver } from '../models/receiver';
import { assign } from '../util/settable';

@Path('receiver')
class ReceiverResource {

    @POST({
        path: ''
    })
    async register(req, res) {
        const receiver = new Receiver();
        assign(receiver, req.body);
        await save(receiver);
        res.send(receiver);
    }

    @GET({
        path: ''
    })
    async getReceivers(req, res: HttpResponse) {
        const receivers = await load(Receiver, 'true = true');
        res.send(receivers);
    }

}