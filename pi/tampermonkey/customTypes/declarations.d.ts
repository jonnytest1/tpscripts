
/// <reference path="../DOM/CircularMenu.js" />
/// <reference path="../libs/log/logging.js" />
/// <reference path="../find.js" />

import { CustomStorage } from '../Storage/storage';
import { GreaseStorage } from '../Storage/greasestorage';

declare global {

    interface Window {
        sc: scI

        backendUrl: string
        finished: Function

        req: Function;

        reqS: import('../libs/require').reqSType
        reqT: Function

        handleError: Function

        evalError: Function
        logKibana: Function
    }
}

interface HTMLChildren extends HTMLElement {
    children: HTMLCollectionOf<HTMLChildren>
}


export interface evalFncOptions {
    text?: string
    parent?: HTMLElement
}

export interface EvalFnc {
    <K extends keyof HTMLElementTagNameMap>(type: K, options: evalFncOptions & { first: true, await: true }): Promise<HTMLElementTagNameMap[K]>;
    <K extends keyof HTMLElementTagNameMap>(type: K, options: evalFncOptions & { await: true }): Promise<Array<HTMLElementTagNameMap[K]>>;

    <K extends keyof HTMLElementTagNameMap>(type: K, options: evalFncOptions & { first: true }): HTMLElementTagNameMap[K];
    <K extends keyof HTMLElementTagNameMap>(type: K, options: evalFncOptions): Array<HTMLElementTagNameMap[K]>;


}

interface PointFnc {
    <T = HTMLElement>(x: number | { x: number, y: number }, y?: number): T
}

interface ElementGetter {
    (string: string, iF?: Element, compress?: Boolean): any;

    I: (string: string, iF?: Element) => HTMLElement | null;
    C: <E>(string: string, iF?: Element, compress?: Boolean) => E | Array<E>;
    T: (string: string, iF?: Element, compress?: Boolean) => any;

    c0: (iF: Element, count: number) => Element,
    W: (top?: boolean, wnd?: any) => Window,
    a: (identification: string, parent?: Element, tag?: string, finder?: Function) => Promise<any>

    eval: EvalFnc,
    point: PointFnc
}



interface Debug {
    n: number;
    c?: any

    e?: Function,

    l?: Function
}


interface scI {
    menu?: CircularMenuInstnace;
    menuContainer: HTMLElement;
    D: Debug;
    CD?: CustomStorage
    G?: GreaseStorage

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
declare global {
    //let handleError: Function
    let scriptContent: String
    let backendUrl: string
    let sc: scI
}