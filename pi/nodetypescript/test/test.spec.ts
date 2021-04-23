import { GeoLocation } from '../resources/mapserver/models/location';

describe('test', () => {

    it('convert geocoord', () => {
        const tile = new GeoLocation(49.460983, 11.061859).toTile(2);

        expect(tile.x)
            .toBe(1.5);
    });
});