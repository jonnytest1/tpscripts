
///<reference path="../site/brandad/test/integrationtest.js" />


declare interface StorageImplementationConstructorType {

    new(base: StorageBase): StorageImplementationType

    filterDaysFunction: filterFunction
}

declare global {

    const StorageImplementation: StorageImplementationConstructorType


    interface Window {
        StorageImplementation: StorageImplementationConstructorType
    }
}


export interface StorageBase {
    get: getter

    set: <T>(identifier: string, value: T) => T
}

export interface getter {
    <T>(identifier: string, standard: T): T
    (identfier: string, standard: boolean): boolean
}

type arrayType<T> = T extends Array<any> ? T[0] : unknown;

declare global {
    export interface StorageImplementationType<K = string, T = any> {


        g: (identifier: K, standrad: T) => T;
        s: (identifier: K, value) => T;

        p: (identifier: K, object: arrayType<T>, options?: any) => void

        filter: (identifier: K, filterFunction: (element: arrayType<T>, index?: number, array?: T) => boolean) => T

        setValue: (identifier: K, key: string, value, standard) => void
        removeWhere: (identifier: K, filterFunction: (element: arrayType<T>, index?: number, array?: T) => boolean) => T
    }
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
