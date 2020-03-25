
///<reference path="../site/brandad/test/integrationtest.js" />
///<reference path="../rotate/https%3A%2F%2Fwww1.swatchseries.to%2Ftvschedule.js" />

declare function getter(identfier: string, standard: boolean): boolean
declare function getter<T>(identifier: string, standard: T): T;



interface CustomStorage {

    g: typeof getter;
    s: (identifier, value) => void;
    p: (identifier, object, standard?) => void

    remove?: (identfier: string, filterFunction: Function, standard?: any) => void;

    filter?: <T> (identfier: string, filterFunction: (element: T) => boolean) => Array<T>;

    setValue;
}


export interface GreaseStorageArrayTypes {

    'basTestingRoute': TestingRouteEvent

    'basFinshedTests': { name: string, steps: Array<TestingRouteEvent> }

    'followedtvshows': CheckedShow

    'openedvideos': OpenedShow
    'recentNewSeries': CheckedShow
}

type GreaseStorageArrayTypesFull<T> = { [P in keyof T]: Array<T[P]>; };
type GreaseArrayTypes = GreaseStorageArrayTypesFull<GreaseStorageArrayTypes>

export interface GreaseStorageType extends GreaseArrayTypes, GreaseStorageObjectArrayTypes {
    'basTestModeEnabled': boolean,

    'LogLevel': { general: "INFO" }
    'novelplanet': { [key: string]: string }
    'mitAlterEgoLastLink': string
    'security_key': string

    'restRequests': { [key: string]: RequestStorage }
    'form': { [key: string]: RequestStorage }
    'otherRequests': { [key: string]: RequestStorage }



}

interface GreaseStorageObjectArrayTypes {
    'kissmangaSeenMangas': { [key: string]: Array<string> }

}


interface greaseSetter {
    <K extends keyof GreaseStorageType>(identifier: K, fallback: GreaseStorageType[K]): void;
}

interface greaseGetter {
    <K extends keyof GreaseStorageType>(identifier: K, value: GreaseStorageType[K]): GreaseStorageType[K];
}


interface greasePushMapOptions<K> extends greasePushOptions<K> {
    mapKey?: string
}
export interface greasePushOptions<K> {
    default?: K,
}

interface greasePush {
    <K extends keyof GreaseArrayTypes>(identifier: K, value: GreaseArrayTypes[K][0], options?: greasePushOptions<GreaseArrayTypes[K]>): void;
    <K extends keyof GreaseStorageObjectArrayTypes>(identifier: K, value: GreaseStorageObjectArrayTypes[K][''][0], options?: greasePushMapOptions<GreaseStorageObjectArrayTypes[K]>): void;
}

interface greaseFilter {
    <K extends keyof GreaseArrayTypes>(identifier: K, filterFunction: (element: GreaseArrayTypes[K][0]) => boolean): GreaseArrayTypes[K];
}

export interface GreaseStorage {
    g: greaseGetter
    s: greaseSetter;
    p: greasePush;

    filter: greaseFilter
    removeWhere: greaseFilter
}