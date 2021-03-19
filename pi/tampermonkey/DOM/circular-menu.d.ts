/// <reference path="./line.js" />
/// <reference path="./rotation-menu.d.ts" />

interface TypeOptionsMap {
    rotate: RotationTypeOptions

    timedRotate: TimedRotationTypeOptions
}

interface TypeAttributeMap {
    rotate: RotationTypeAttributes
    timedRotate: RotationTypeAttributes
}

interface CircularMenuHTMLButton<K extends keyof TypeOptionsMap = any> extends HTMLElement {

    menuOption?: MenuElementItem<K>,
    center?: Vector,
    menu?: CircularMenuInstnace,
    degree?: number,
    parentSpace?: number

    typeAttributes?: TypeAttributeMap[K]

}

declare interface MenuElementItem<K extends keyof TypeOptionsMap> {
    children?: Array<MenuElementItem<any>>
    name?: string
    onclick?: Function,
    mouseOver?: (parent: HTMLElement, btn: CircularMenuHTMLButton<K>) => (boolean | void)
    mouseLeave?: (parent: HTMLElement, btn: CircularMenuHTMLButton<K>) => boolean | void

    isValid?: (target) => boolean

    creationFunction?: CreateElement
    type?: K

    typeOptions?: TypeOptionsMap[K]
    enabledColor?: Colors
    normalColor?: Colors

    element?: CircularMenuHTMLButton<K>

    rotation?: number
    line?: {
        remove: Function
    }
    lib?: string
    style?: OptionalStyle
}

type MenuTypesLibrary = { [P in keyof TypeOptionsMap]: RegistrationFunction };

declare type RegistrationFunction<K extends keyof TypeOptionsMap = any> = (item: MenuElementItem<K>, types: MenuTypesLibrary) => void
declare type TypeRegistration<K extends keyof TypeOptionsMap> = [K, RegistrationFunction<K>]

declare interface CircularMenuInstnace {
    addToMenu: addToMenuFnc,
    createElement: CreateElement,

    setButtons?: Function,

    remove: () => void
    removeByName: (name: string) => void
    removeByLib: (libName: string) => void
}


interface addToMenuFnc {
    <K extends keyof TypeOptionsMap>(menu: MenuElementItem<K>, selector?: (ar: MenuElementItem<any>[]) => MenuElementItem<K> | MenuElementItem<any>[]): MenuElementItem<K>;

    // <K extends keyof RequireMap>(path: K, options?: any): Promise<RequireMap[K]>;
}