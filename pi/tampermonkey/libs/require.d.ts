
///<reference path="../DOM/CircularMenu.js"/>
///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
/// <reference path="../time.js" />
/// <reference path="../notification.js" />
/// <reference path="../learning/knnIO.js" />
/// <reference path="../Storage/localStorage.js" />

export interface RequireMap {

    'http': httpResolv

    'learning/tensorflow': void

    'learning/knnIO': KNNLoader;


    'learning/tfIO': any
    'libs/eval-script': void
    'libs/log-level': void

    'libs/log/logging': void
    'notification': notificationI
    'find': ElementGetter
    'graphics/p5addon': void

    'graphics/canvas': void
    'DOM/CircularMenu': CircularMenuResolv;
    'DOM/customSlider': void
    'DOM/DOMConstants': DConstants;
    'DOM/dependencyCheck': void
    'DOM/line': void

    'DOM/button': void
    'site/kissanime/buildModel': void
    'Storage/SessionStorage': CustomStorage
    'Storage/crossDomainStorage': any
    'Storage/localStorage': LocalStorage

    'test/php/testing': void
    'time': CustomTimeClass
    'Videos/next',


}

export interface reqSType {
    <K extends keyof RequireMap>(path: K, options?: any): Promise<RequireMap[K]>;
}
