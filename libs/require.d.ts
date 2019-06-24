///<reference path="../DOM/DOMConstants.js"/>
///<reference path="../http.js"/>
export interface RequireMap {

    'http':httpResolv

    'libs/eval-script':void

    'logging':void
    'learning/tensorflow':void
    'notification':void
    'find':ElementGetter

    'DOM/CircularMenu':void
    'DOM/DOMConstants':DConstants;
    'DOM/dependencyCheck':void
    'DOM/line':void

    'DOM/button':void

    'Storage/SessionStorage':any
}

export interface reqSType {
    <K extends keyof RequireMap>(path:K):Promise<RequireMap[K]>;
}
