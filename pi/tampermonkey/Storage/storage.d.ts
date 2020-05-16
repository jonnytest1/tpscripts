
///<reference path="../site/brandad/test/integrationtest.js" />
///<reference path="../rotate/https%3A%2F%2Fwww1.swatchseries.to%2Ftvschedule.js" />


declare interface StorageImplementationConstructorType {

    new(base: StorageBase): StorageImplementationType

    filterDaysFunction: Function
}

declare global {

    const StorageImplementation: StorageImplementationConstructorType


    interface Window {
        StorageImplementation: StorageImplementationConstructorType
    }
}


export interface StorageBase {
    get: getter

    set: (identifier: string, value) => void
}

export interface getter {
    <T>(identifier: string, standard: T): T
    (identfier: string, standard: boolean): boolean
}

export interface StorageImplementationType {
    g: (identifier: string, standrad) => any;
    s: (identifier: string, value) => void;

    p: (identifier: string, object, options?: any) => void

    filter: (identifier: string, filterFunction: (element, index?: number, array?: Array<any>) => boolean) => Array<any>

    setValue: (identifier: string, key: string, value, standard) => void
    removeWhere: (identifier: string, filterFunction: (element, index?: number, array?: Array<any>) => boolean) => Array<any>
}

interface CustomStorage {

    g: (identifier, standrad) => any;
    s: (identifier, value) => void;
    p: (identifier, object, standard?) => void

    remove?: (identfier: string, filterFunction: Function, standard?: any) => void;

    filter?: <T> (identfier: string, filterFunction: (element: T) => boolean) => Array<T>;

    setValue;
}


export interface TimedObject<T> {

    timestamp: number;

    value: T
}

interface FilterOptions {
    keepLatest?: boolean
}
export interface filterFunction {
    (days: number, options?: FilterOptions): (element: TimedObject<any>, index: number, array: Array<TimedObject<any>>) => boolean
}


interface PushMapOptions<K> extends PushOptions<K> {
    mapKey?: string
}
export interface PushOptions<K> {
    default?: K,
}
