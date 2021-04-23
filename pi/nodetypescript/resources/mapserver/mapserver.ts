import { exists, promises } from 'fs';
import { save } from 'hibernatets';
import { GET, HttpRequest, HttpResponse, Path, POST } from '../../express-wrapper/express-wrapper';
import { ResponseCodeError } from '../../express-wrapper/response-code-error';
import { BoundingBox } from './models/bounding-box';
import { GeoLocation } from './models/location';
import { Site } from './models/site';
import { Tile } from './models/tile';
import { AddressResolver } from './service/address-from-geo';
import { ImageResolver } from './service/image-resolver';
import { worldMapResolverInstance } from './service/woirld-map-resolver';
const { convert } = require('convert-svg-to-png');

const siteMap = new Map();

const sites: Array<Site> = [];

const countries: {
    [countryname: string]: {
        boundingbox: BoundingBox,
        tile: Tile
    }
} = {};

@Path('mapserver')
export class Mapserver {

    private static addressResolver = new AddressResolver();

    @POST({ path: 'register' })
    async registerGitHub(req: HttpRequest, res: HttpResponse) {

        if (!req.body.url.endsWith('.json')) {
            throw new ResponseCodeError(400, 'url needs to be a json');
        }
        const site = new Site(req.body.url, new GeoLocation(+req.body.lat, +req.body.lon));
        sites.push(site);
        res.send('ok');
        site.address = await Mapserver.addressResolver.getAddressFromGeo(site.location);

        if (!countries[site.address.country_code]) {
            const countryData = await Mapserver.addressResolver.getCountryData(site.location);
            const imageTile = await ImageResolver.getTileForPos(site.location);
            //https://c.tile.openstreetmap.de/{z}/{x}/{y}.png
            countries[site.address.country_code] = {
                boundingbox: countryData.boundingbox,
                tile: imageTile
            };
            console.log('set country');
        }
    }

    @GET({ path: 'image/:zoom/:x/:y.png' })
    async countryimage(req: HttpRequest, res: HttpResponse) {

        const tempTile = new Tile();
        tempTile.x = req.params.y; //stored wrong :(
        tempTile.y = req.params.x;
        tempTile.zoom = req.params.zoom;
        const tile = await ImageResolver.loadTileData(tempTile);
        res.set('Content-Type', 'image/png')
            .send(Buffer.from(await tile.data));
    }

    @GET({ path: 'assets/:image' })
    async assets(req, res) {
        const path = req.params.image;
        if (path.includes('..') || path.includes('/')) {
            throw new ResponseCodeError(403, '');
        }
        const buffer = await promises.readFile(`${__dirname}/service/resources/${path}`);
        res.set('Content-Type', 'image/png')
            .send(buffer);
    }

    @GET({ path: 'site.json' })
    async getRenderedSite(req, res) {
        const worldMapJsonString = await worldMapResolverInstance.getWorldMapJson();
        res.set('Content-Type', 'application/json')
            .send(worldMapJsonString);
    }

}