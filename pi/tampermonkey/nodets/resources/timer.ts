import { log } from 'console';
import { Request, Response } from 'express';
import { GET, POST } from '../express-wrapper';
import { logKibana } from '../util/log';

const timers: { [key: string]: { name: string, duration: number } } = {
    '4100060012329': {
        name: 'ACE',
        duration: 6
    }
};
export class Timer {

    @POST({
        path: '/timer'
    })
    async timerFnc(req: Request, res: Response) {
        if (typeof req.body !== 'string') {
            console.error('wrong type');
            res.status(400)
                .send();
            return;
        }
        const timer = timers[req.body];
        if (!timer) {
            logKibana('ERROR', {
                message: 'missing TIMER',
                timer: req.body
            });
            res.status(404)
                .send();
            return;
        }
        res.send(`set ${timer.duration} minutes \nfor ${timer.name}`);
    }

    @GET({
        path: '/'
    })
    async timers(req: Request, res: Response) {
        console.log(req.body);
        console.log(req.method);
        res.send('hi\n');
    }
}