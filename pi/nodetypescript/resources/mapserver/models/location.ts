import { load } from 'hibernatets';
import { Tile } from './tile';

const earthRadius = 6378137;
const maxLat = 85.0511287798;
const convert = Math.PI / 180;

const transformationConstant = 0.5 / (Math.PI * earthRadius);
export class GeoLocation {

    constructor(public lat: number, public lon: number) { }

    toTile(zoom: number): Tile {
        const lat = Math.max(Math.min(maxLat, this.lat), -maxLat);
        const sin = Math.sin(lat * convert);

        const scale = 256 * Math.pow(2, zoom);

        const projX = earthRadius * this.lon * convert;
        const projY = (earthRadius * Math.log((1 + sin) / (1 - sin)) / 2);

        const pxBoundsX = scale * (transformationConstant * projX + 0.5);
        const pxBoundsY = scale * (-transformationConstant * projY + 0.5);

        const tile = new Tile();
        tile.x = Math.floor(pxBoundsX / 256);
        tile.y = Math.ceil(pxBoundsY / 256) - 1;
        tile.zoom = zoom;
        return tile;

    }

    dividedBy(divisor: number) {
        return new GeoLocation(this.lat / divisor, this.lon / divisor);
    }

    rounded() {
        return new GeoLocation(Math.round(this.lat), Math.round(this.lon));
    }

}