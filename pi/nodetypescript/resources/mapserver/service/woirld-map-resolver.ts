
import { Tile } from '../models/tile';
import { ImageResolver } from './image-resolver';
import { Map } from './resources/map';
let defaultJson: Map = require('./resources/default-map.json');

class WorldMapResolver {

    images: Array<Array<{ tile: Tile, imageData: Array<number>, width: number, height: number }>> = [];

    maxX = 15;
    maxY = 15;

    worldZoom = 4;
    readonly startLayersId = 10000;
    completedMap: Tile;
    worldMapJsonString: string;

    readonly indexesInCompleteRow = 16 * 8;

    readonly debugOffset = 200000;

    async getWorldMapJson() {

        defaultJson.tilesets.length = 1;
        defaultJson.layers = [];
        if (this.worldMapJsonString) {
            // return this.worldMapJsonString;
        }

        defaultJson.width = defaultJson.height = 16 * 256 / 32;
        let startGid = 668;
        const tileSize = 8;
        const dataArray = [];
        const startLayerData = [];
        for (let i = 0; i < 16; i++) {
            for (let y = 0; y < 16; y++) {
                const tileCount = 64;
                defaultJson.tilesets.push({
                    columns: 256 / 32,
                    imageheight: 256,
                    imagewidth: 256,
                    image: `/image/${4}/${i}/${y}.png`,
                    name: `tileset-${4}-${i}-${y}`,
                    margin: 0,
                    spacing: 0,
                    tilecount: tileCount,
                    tileheight: 32,
                    tilewidth: 32,
                    transparentcolor: '#fff',
                    firstgid: startGid
                });
                for (let tileColumn = 0; tileColumn < tileSize; tileColumn++) {
                    for (let tileRow = 0; tileRow < tileSize; tileRow++) {
                        const tileIndex = tileColumn * tileSize + tileRow;
                        const rowStart = ((8 * i) + tileColumn) * this.indexesInCompleteRow;
                        const dataIndex = rowStart + (y * tileSize) + tileRow;

                        dataArray[dataIndex] = startGid + tileIndex;

                        startLayerData.push(Math.random() < 0.05 ? 374 : 0);
                    }
                }
                startGid += tileCount;
            }
        }

        defaultJson.layers.push({
            data: dataArray,
            name: 'background-image',
            id: 20000,
            'opacity': 1,
            'visible': true,
            height: this.indexesInCompleteRow,
            width: this.indexesInCompleteRow,
            x: 0,
            y: 0,
            type: 'tilelayer'
        });

        defaultJson.layers.push({
            'x': 0,
            'y': 0,
            data: startLayerData,
            'name': 'start',
            properties: [
                {
                    'name': 'startLayer',
                    'type': 'bool',
                    'value': true
                }
            ],
            'opacity': 1,
            'type': 'tilelayer',
            'visible': true,
            'width': this.indexesInCompleteRow,
            height: this.indexesInCompleteRow,
            id: this.startLayersId + this.debugOffset

        });

        defaultJson.layers.push({
            draworder: 'topdown',
            objects: [],
            opacity: 1,
            name: 'floorLayer',
            id: 30000,
            height: this.indexesInCompleteRow,
            width: this.indexesInCompleteRow,
            x: 0,
            y: 0,
            type: 'objectgroup'
        });
        for (let i = 0; i < 4; i++) {//indexesInCompleteRow
            this.addContinuationLayersForRow(i);
        }

        defaultJson.layers.sort((l1, l2) => l1.id - l2.id);
        defaultJson.layers.forEach((layers, index) => {
            layers.id = index;
        });

        this.worldMapJsonString = JSON.stringify(defaultJson);
        return this.worldMapJsonString;
    }

    addContinuationLayersForRow(currentRow: number) {
        const firstInRow = this.indexesInCompleteRow * currentRow;
        const endOfRow = firstInRow + this.indexesInCompleteRow - 1;

        const exitArrayRight = Array(16384)
            .fill(0);
        exitArrayRight.splice(endOfRow, 1, 384);
        const startArrayLeft = Array(16384)
            .fill(0);
        //const startArrayLeft = [374];
        startArrayLeft.splice(firstInRow + 1, 1, 374);
        defaultJson.layers.push({
            data: exitArrayRight,
            name: `exit-${currentRow}-right`,
            id: this.startLayersId + 1 + this.debugOffset,
            'opacity': 1,
            'visible': true,
            properties: [
                {
                    name: 'exitSceneUrl',
                    type: 'string',
                    value: `#start-${currentRow}-left`
                }
            ],
            height: this.indexesInCompleteRow,
            width: this.indexesInCompleteRow,
            x: 0,
            y: 0,
            type: 'tilelayer'
        });
        defaultJson.layers.push({
            data: startArrayLeft,
            name: `start-${currentRow}-left`,
            id: this.startLayersId + 5 + this.debugOffset,
            'opacity': 1,
            'visible': true,
            properties: [
                {
                    'name': 'startLayer',
                    'type': 'bool',
                    'value': true
                }
            ],
            height: this.indexesInCompleteRow,
            width: this.indexesInCompleteRow,
            x: 1,
            y: currentRow + 1,
            type: 'tilelayer'

        });
    }

    async completeRow(x: number): Promise<void> {
        if (!this.images[x]) {
            this.images[x] = [];
        }

        for (let i in arrayOfLength(this.maxY + 1)) {
            const tileRef = new Tile();
            tileRef.x = x;
            tileRef.y = i;
            tileRef.zoom = this.worldZoom;
            await ImageResolver.loadTileData(tileRef);
        }

    }
}

function arrayOfLength(length: number) {
    return Array.from({
        length: length
    });
}

export const worldMapResolverInstance = new WorldMapResolver();