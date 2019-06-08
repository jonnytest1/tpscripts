

/// <reference path="../DOM/button.js" />

declare interface Window {
    crIN: Function

    crBE: Function
}
//declare var window: DOMWindow;
declare let crIN: (parent: HTMLElement, text: String, fncclick?: Function, fncmouseEnter?: Function, fncMouseLeave?: Function, fncopen?: Function, options?) => HTMLElement

declare let crBE: Function