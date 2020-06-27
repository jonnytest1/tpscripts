

/// <reference path="../DOM/button.js" />

declare interface Window {
    crIN: Function

    crBE: Function
}


interface StyleNumbers {

    'width'
    'height',
    bottom,
    left,
    right,

    top,
    borderRadius,
    fontSize
}


type OptionalStyle = Partial<Omit<CSSStyleDeclaration, keyof StyleNumbers> & {
    [P in keyof StyleNumbers]: number | string
}>


interface createButton {
    <T>(parent: ButtonOptions): HTMLElement
    <T>(parent: HTMLElement, text?: String, fncclick?: Function, fncmouseEnter?: Function, fncMouseLeave?: (btn: HTMLElement) => any, fncopen?: string,
        options?: { style: OptionalStyle } & T): HTMLElement
}

//declare var window: DOMWindow;
declare let crIN: createButton
declare let crBE: Function