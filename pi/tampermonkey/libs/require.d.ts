
///<reference path="../DOM/CircularMenu.js"/>
///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
/// <reference path="../time.js" />
/// <reference path="../notification.js" />
/// <reference path="../learning/knnIO.js" />
/// <reference path="../Storage/localStorage.js" />

export interface RequireMap {

    'http':httpResolv

    'libs/eval-script':void

    'logging':void
    'learning/tensorflow':void

    'learning/knnIO':KNNLoader;


    'learning/tfIO':any
    'notification':notificationI
    'find':ElementGetter
    'graphics/p5addon':void

    'graphics/canvas':void
    'DOM/CircularMenu':CircularMenuResolv;
    'DOM/customSlider':void
    'DOM/DOMConstants':DConstants;
    'DOM/dependencyCheck':void
    'DOM/line':void

    'DOM/button':void
    'site/kissanime/buildModel':void
    'Storage/SessionStorage':any
    'Storage/crossDomainStorage':any
    'Storage/localStorage':LocalStorage

    'test/php/testing':void
    'time': CustomTimeClass
    'Videos/next',

    
}

export interface reqSType {
    <K extends keyof RequireMap>(path:K):Promise<RequireMap[K]>;
}
