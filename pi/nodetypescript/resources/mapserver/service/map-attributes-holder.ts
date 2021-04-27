
export class MapAttributes {

    static readonly imageSize = 256;

    static readonly tileSize = 32;
    static readonly indexesPerTile = MapAttributes.imageSize / MapAttributes.tileSize;

    static readonly layerSizePerMap = 8; // 16
    constructor() {
        //TODO
    }

    static getMaxAmountOfImagesForZoom(zoom: number) {
        return Math.pow(2, zoom);
    }

    static getAmountOfIndicesForZoom(zoom: number) {
        return this.getMaxAmountOfImagesForZoom(zoom) * MapAttributes.indexesPerTile;
    }
}