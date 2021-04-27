import { column, primary, table } from 'hibernatets';
import { TilePixel } from './tile-pixel';

@table()
export class SiteTilePosition {

    @primary()

    id: string;

    @column({ type: 'number' })
    zoom: number;

    @column({ type: 'number' })
    tileX: number;

    @column({ type: 'number' })
    tileY;

    toTilePixel() {
        return new TilePixel(this.tileY, this.tileX, this.zoom);
    }
}