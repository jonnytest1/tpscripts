
///<reference path="../DOM/CircularMenu.js"/>
///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
/// <reference path="../time.js" />
/// <reference path="../notification.js" />
/// <reference path="../learning/knnIO.js" />
/// <reference path="../Storage/localStorage.js" />
/// <reference path="../site/swatchseries/swatchseries.to%episode%.js" />
/// <reference path="../site/brandad/spider.js" />
/// <reference path="../DOM/button.js" />
/// <reference path="../DOM/table.js" />
/// <reference path="../DOM/dialog.js" />
/// <reference path="../DOM/progress-overlay.js" />
/// <reference path="../libs/indexeddb.js" />

import { ElementGetter } from '../customTypes/declarations';
import { CustomStorage, StorageBase } from '../Storage/storage';

export interface RequireMap {

    'http': httpResolv

    'learning/tensorflow': void

    'learning/knnIO': KNNLoader;


    'learning/tfIO': any

    'libs/dom/selector': (element: HTMLElement) => string
    'libs/eval-script': void

    'libs/indexeddb': indexedDB
    'libs/log-level': void

    'libs/log/logging': void

    'libs/math/vector-2d': any
    'notification': notificationI
    'find': ElementGetter
    'graphics/p5addon': void

    'graphics/canvas': void
    'DOM/CircularMenu': CircularMenuResolv;
    'DOM/customSlider': void

    'DOM/dialog': DOMDialogConstructor
    'DOM/DOMConstants': DConstants;
    'DOM/dependencyCheck': void

    'DOM/progress-overlay': (callback: (optinos: ProgressOverlayOptions) => Promise<number> | number, optinos?: ProgressOverlayOptions) => ExpandedProgressOverlayOptions
    'DOM/line': void
    'DOM/table': DOMTableCosntructor
    'DOM/button': ButtonRes

    "site/brandad/attack": (request: RequestStorage) => Promise<Array<{
        request: string, response: string
    }>>,


    "site/brandad/main": void;

    "site/brandad/requestoverview": (dialog: Dialog) => void
    'site/brandad/result': (dialog: Dialog, result: Array<{ request: string, response: string }>) => void

    'site/brandad/singlerequest': (dialog: Dialog, url: string, requestData: { [key: string]: RequestStorage }) => HTMLElement;
    'site/brandad/spider': void;

    'site/brandad/test/integrationtest': () => void
    'site/brandad/test/tester': (dialog: Dialog) => void
    'site/kissanime/buildModel': void
    "site/kissanime/confirm": void
    /**
     * @see {site/kissanime/testModel.js}
     */
    'site/kissanime/data-to-browser-db': () => Promise<Array<{ data: string, tags: Array<{ tag_name: string }> }>>
    'site/kissanime/testModel': void
    'site/kissanime/areyouhuman': unknown

    'Storage/SessionStorage': CustomStorage
    'Storage/crossDomainStorage': CustomStorage
    'Storage/localStorage': LocalStorage

    "Storage/greaseBase": StorageBase
    'Storage/storageimpl': void


    'test/php/testing': void
    'time': CustomTimeClass
    'Videos/next': (link: videoLink, links: Array<any>, excluded: Array<string>) => boolean

    'Videos/automation': any
}

export interface reqSType {
    <K extends keyof RequireMap>(path: K, options?: any): Promise<RequireMap[K]>;


    <
        K extends keyof RequireMap,
        T extends keyof RequireMap>(path: [
            K,
            T
        ], options?: any):
        Promise<[
            RequireMap[K],
            RequireMap[T]
        ]>;
    //
    <
        K extends keyof RequireMap,
        U extends keyof RequireMap,
        T extends keyof RequireMap>(path: [
            K,
            T,
            U
        ], options?: any):
        Promise<[
            RequireMap[K],
            RequireMap[T],
            RequireMap[U]
        ]>;
    //
    <
        K extends keyof RequireMap,
        T extends keyof RequireMap,
        S extends keyof RequireMap,
        U extends keyof RequireMap>(path: [
            K,
            T,
            S,
            U
        ], options?: any):
        Promise<[
            RequireMap[K],
            RequireMap[T],
            RequireMap[S],
            RequireMap[U]
        ]>;
    //
    <
        K extends keyof RequireMap,
        T extends keyof RequireMap,
        S extends keyof RequireMap,
        I extends keyof RequireMap,
        U extends keyof RequireMap>(path: [
            K,
            T,
            S,
            I,
            U
        ], options?: any):
        Promise<[
            RequireMap[K],
            RequireMap[T],
            RequireMap[S],
            RequireMap[I],
            RequireMap[U]
        ]>;

}
