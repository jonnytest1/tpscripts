
/// <reference path="../DOM/CircularMenu.js" />
/// <reference path="../logging.js" />
/// <reference path="../find.js" />

declare interface Window {
    backendUrl: string
    finished: Function

    req: Function;

    reqS: Function
    reqT: Function

    handleError: Function

    evalError: Function
    logKibana: Function

    sc: scI
}
declare var window: Window;

interface HTMLChildren extends HTMLElement {
    children: HTMLCollectionOf<HTMLChildren>
}

interface ElementGetter {
    (string: string, iF?: Element, compress?: Boolean): any;

    I: (string: string, iF?: Element) => HTMLElement | null;
    C: <E extends Element = Element>(string: string, iF?: Element, compress?: Boolean) => E;
    T: (string: string, iF?: Element, compress?: Boolean) => any;

    c0: (iF: Element, count: number) => Element,
    W: (top?: boolean, wnd?: Element) => Window,
    a: (identification: string, parent?: Element, tag?: string, finder?: Function) => Promise<any>
}



interface Debug {
    n: number;
    c?: any

    e?: Function,

    l?: Function
}

interface CustomStorage {
    g: Function;
    s: Function;
    p: Function;

    remove?: (identfier: string, filterFunction: Function, standard?: any) => void;

    filter?: (identfier: string, filterFunction: Function, standard?: any) => void;
}
interface scI {
    menu?: CircularMenu;
    menuContainer: HTMLElement;
    D: Debug;
    CD?: CustomStorage
    G?: CustomStorage

    L?: CustomStorage
    S?: CustomStorage;
    g?: ElementGetter
    circularmenu?: HTMLElement
}

declare let scriptContent: String

declare let backendUrl: string
//declare let reqS: Function
//declare let sc: scI;
declare let IMPORT: any
/*declare global {
    let handleError: Function
    let scriptContent: String
    let backendUrl: string
    let sc: scI
}*/