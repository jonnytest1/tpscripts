
///<reference path="../DOM/CircularMenu.js"/>
///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
/// <reference path="../time.js" />
/// <reference path="../notification.js" />
/// <reference path="../learning/knnIO.js" />
/// <reference path="../Storage/localStorage.js" />
/// <reference path="../site/swatchseries/swatchseries.to%episode%.js" />
/// <reference path="../site/brandad/spider.js" />
/// <reference path="../DOM/table.js" />
/// <reference path="../DOM/dialog.js" />

import { ElementGetter } from '../customTypes/declarations';
import { CustomStorage } from '../customTypes/storage';

export interface RequireMap {

    'http': httpResolv

    'learning/tensorflow': void

    'learning/knnIO': KNNLoader;


    'learning/tfIO': any

    'libs/dom/selector': (element: HTMLElement) => string
    'libs/eval-script': void
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
    'DOM/line': void
    'DOM/table': DOMTableCosntructor
    'DOM/button': void

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
    'Storage/SessionStorage': CustomStorage
    'Storage/crossDomainStorage': CustomStorage
    'Storage/localStorage': LocalStorage

    'test/php/testing': void
    'time': CustomTimeClass
    'Videos/next': (link: videoLink, links: Array<any>, excluded: Array<string>) => boolean

    'Videos/automation': any
}

export interface reqSType {
    <K extends keyof RequireMap>(path: K, options?: any): Promise<RequireMap[K]>;
}
