

///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
/// <reference path="../time.js" />
export interface RequireMap {

    'http':httpResolv

    'libs/eval-script':void

    'logging':void
    'learning/tensorflow':void
    'learning/knnIO':any
    'learning/tfIO':any
    'notification':void
    'find':ElementGetter
    'graphics/p5addon':void

    'graphics/canvas':void
    'DOM/CircularMenu':void
    'DOM/customSlider':void
    'DOM/DOMConstants':DConstants;
    'DOM/dependencyCheck':void
    'DOM/line':void

    'DOM/button':void
    'site/kissanime/buildModel':void
    'Storage/SessionStorage':any
    'Storage/crossDomainStorage':any
    'Storage/localStorage':any
    'time': CustomTimeClass
    'Videos/next'
}

export interface reqSType {
    <K extends keyof RequireMap>(path:K):Promise<RequireMap[K]>;
}
