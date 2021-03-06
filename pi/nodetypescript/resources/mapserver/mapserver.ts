import { GET, HttpRequest, HttpResponse, Path, POST, ResponseCodeError } from 'express-hibernate-wrapper';
import { promises } from 'fs';
import { load, save } from 'hibernatets';
import { type } from 'os';
import { GeoLocation } from './models/location';
import { Site } from './models/site';
import { Tile } from './models/tile';
import { AddressResolver } from './service/address-from-geo';
import { ImageResolver } from './service/image-resolver';
import { MapAttributes } from './service/map-attributes-holder';
import { SitesAdder } from './service/site-adder';
import { MapResolver } from './service/woirld-map-resolver';
@Path('mapserver')
export class Mapserver {

    private static addressResolver = new AddressResolver();

    @POST({ path: 'register' })
    async registerGitHub(req: HttpRequest, res: HttpResponse) {

        if (!req.body.url.endsWith('.json')) {
            throw new ResponseCodeError(400, 'url needs to be a json');
        }
        if (isNaN(+req.body.lat) || isNaN(+req.body.lon)) {
            throw new ResponseCodeError(400, 'positions need to be a number');
        }
        const site = new Site(req.body.url, new GeoLocation(+req.body.lat, +req.body.lon));

        if (req.body.icon && typeof req.body.icon === 'number') {
            site.iconIndex = req.body.icon;
        }
        const location = site.getLocation();
        site.address = await Mapserver.addressResolver.getAddressFromGeo(location);
        await save(site);
        res.send('ok');
        /*if (!countries[site.address.country_code]) {
            const countryData = await Mapserver.addressResolver.getCountryData(location);
            const imageTile = await ImageResolver.getTileForPos(location);
            //https://c.tile.openstreetmap.de/{z}/{x}/{y}.png
            countries[site.address.country_code] = {
                boundingbox: countryData.boundingbox,
                tile: imageTile
            };
            console.log('set country');
        }*/
    }

    @GET({ path: '' })
    async index(req, res: HttpResponse) {
        const buffer = await promises.readFile(`${__dirname}/service/resources/register.html`);
        res.set('Content-Type', 'text/html')
            .send(buffer);
    }

    @GET({ path: 'image/:zoom/:x/:y.png' })
    @GET({ path: '/world/image/:zoom/:x/:y.png' })
    @GET({ path: ':_/lat/:_/lon/:_/image/:zoom/:x/:y.png' })
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
    @GET({ path: '/world/assets/:image' })
    @GET({ path: ':zoom/lat/:tileX/lon/:tileY/assets/:image' })
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
    @GET({ path: '/world/site.json' })
    async getRenderedSite(req: HttpRequest, res) {
        if (req.path.includes('/world/site.json')) {
            const worldMapJsonString = await new MapResolver().getWorldMapJson();
            res.set('Content-Type', 'application/json')
                .send(worldMapJsonString);
            return;
        }
        const sites = await load(Site, 'TRUE=TRUE', undefined, {
            deep: true
        });

        const pixel = new SitesAdder(new MapResolver()).getFirstTilePixelWithMultipleSites(sites);
        console.log(`${pixel.zoom} - ${pixel.lon} - ${pixel.lat}`);
        const topLevelJsonString = await new MapResolver(pixel.zoom, pixel.lon, pixel.lat).getWorldMapJson();
        res.set('Content-Type', 'application/json')
            .send(topLevelJsonString);
    }

    @GET({ path: ':zoom/lat/:tileX/lon/:tileY/site.json' })
    async getRenderedSiteForPosition(req: HttpRequest, res: HttpResponse) {
        if (!req.params.zoom || isNaN(+req.params.zoom)) {
            res.status(400)
                .send();
            return;
        }
        let zoom = +req.params.zoom;
        zoom = Math.min(18, zoom);
        /*
        const previousZoom = zoom - MapResolver.zoomIncrement;
           const amountOfIndicesInPreviousZoom = MapResolver.getAmountOfIndicesForZoom(previousZoom);
           const amountOFIndicesInCurrentZoom = MapResolver.getAmountOfIndicesForZoom(zoom);

           const layerOffset = 1;
           const unscaledX = (543 - layerOffset) / amountOfIndicesInPreviousZoom;
           const unscaledY = (350 - layerOffset) / amountOfIndicesInPreviousZoom;

           const startTilex = Math.round(unscaledX * amountOFIndicesInCurrentZoom / MapResolver.indexesPerTile);
           const startTileY = Math.round(unscaledY * amountOFIndicesInCurrentZoom / MapResolver.indexesPerTile);*/

        const mapReolver = new MapResolver(zoom, +req.params.tileX, +req.params.tileY, MapAttributes.layerSizePerMap);
        const worldMapJsonString = await mapReolver.getWorldMapJson();
        res.set('Content-Type', 'application/json')
            .send(worldMapJsonString);
    }
}