

/// <reference path="../DOM/button.js" />

declare interface Window {
    crIN: Function

    crBE: Function
}

type OptionalStyle = Partial<CSSStyleDeclaration | {
    width: number | string | null,
    left: number | string | null
}>


//declare var window: DOMWindow;
declare let crIN: <T>(parent: HTMLElement, text: String, fncclick?: Function, fncmouseEnter?: Function, fncMouseLeave?: (btn: HTMLElement) => any, fncopen?: string,
    options?: { style: OptionalStyle } & T) => HTMLElement

declare let crBE: Function