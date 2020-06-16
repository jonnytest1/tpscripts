import { Request, Response } from 'express';
import { GET } from '../express-wrapper';
class TestREsource {

    @GET({
        path: '/test'
    })
    async testGet(req: Request, res: Response) {
        res.send('hi');
    }
}