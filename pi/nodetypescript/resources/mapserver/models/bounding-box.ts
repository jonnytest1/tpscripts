import { GeoLocation } from './location';

export interface BoundingBox {
    topLeft: GeoLocation,
    bottomRight: GeoLocation
}