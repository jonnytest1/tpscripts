import { TimedObject, PushOptions, PushMapOptions } from "./storage"

export interface GreaseStorageArrayTypes {

    'basTestingRoute': TestingRouteEvent

    'basFinshedTests': { name: string, steps: Array<TestingRouteEvent> }

    'followedtvshows': CheckedShow

    'openedvideos': OpenedShow
    'recentNewSeries': CheckedShow

    crunchyrollOpenedVideos: TimedObject<string>

    delayedYoutube: { url: string, title: string }

    delayedYoutubeCheck: TimedObject<string>

    'tempSS': any

    twitchvideoposition: TimedObject<{ currentTime: number, url: string }>
}

type GreaseStorageArrayTypesFull<T> = { [P in keyof T]: Array<T[P]>; };
type GreaseArrayTypes = GreaseStorageArrayTypesFull<GreaseStorageArrayTypes>


interface GreaseStorageObjectArrayTypes {
    'kissmangaSeenMangas': { [key: string]: Array<TimedObject<string>> }
    'manganeloSeenMangas': { [key: string]: Array<TimedObject<string>> }
}
export interface GreaseStorageType extends GreaseArrayTypes, GreaseStorageObjectArrayTypes {
    'basTestModeEnabled': boolean,
    "kissmangaLastCheck": number
    'LogLevel': { general: "INFO" }

    kissmangainlatest: string
    'kissmangainMangas': {
        [key: string]: {
            lastEpisode?: string,
            shortKey?: string,
            imageUrl?: string,
            mangaName?: string
        }
    }
    manganelolatest: string
    manganeloMangas: {
        [key: string]: {
            lastEpisode?: string,
        }
    }
    'novelplanet': { [key: string]: string }
    'urlwhitelist': { [key: string]: 'same-origin' | true }
    'mitAlterEgoLastLink': string
    'security_key': string
    'restRequests': { [key: string]: RequestStorage }
    'form': { [key: string]: RequestStorage }
    'otherRequests': { [key: string]: RequestStorage }

    'urlChange': { old: string, new: string }
}




interface greaseSetter {
    <K extends keyof GreaseStorageType>(identifier: K, value: GreaseStorageType[K]): GreaseStorageType[K];
}

interface greaseGetter {
    <K extends keyof GreaseStorageType>(identifier: K, fallback?: GreaseStorageType[K]): GreaseStorageType[K];
}




interface greasePush {
    <K extends keyof GreaseArrayTypes>(identifier: K, value: GreaseArrayTypes[K][0], options?: PushOptions<GreaseArrayTypes[K]>): void;
    <K extends keyof GreaseStorageObjectArrayTypes>(identifier: K, value: GreaseStorageObjectArrayTypes[K][''][0], options?: PushMapOptions<GreaseStorageObjectArrayTypes[K]>): void;
}



export interface greaseFilterOptions {
    mapKey?: string
}

export interface greaseFilter {
    <K extends keyof GreaseArrayTypes>(identifier: K, filterFunction: (element: GreaseArrayTypes[K][0], index?: number, array?: GreaseArrayTypes[K]) => boolean): GreaseArrayTypes[K];
    <K extends keyof GreaseStorageObjectArrayTypes>(identifier: K, filterFunction: (element: GreaseStorageObjectArrayTypes[K][''][0], index?: number, array?: GreaseStorageObjectArrayTypes[K]['']) => boolean, options?: greaseFilterOptions): GreaseStorageObjectArrayTypes[K][''];
}


export interface GreaseStorage extends StorageImplementationType {
    g: greaseGetter
    s: greaseSetter;
    p: greasePush;

    filter: greaseFilter
    removeWhere: greaseFilter,

}