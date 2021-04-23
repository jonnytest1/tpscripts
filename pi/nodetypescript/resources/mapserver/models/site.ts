import { Address } from './address'
import { GeoLocation } from './location'

export class Site {

    constructor(public url: string, public location: GeoLocation) {

    }

    address: Address


}