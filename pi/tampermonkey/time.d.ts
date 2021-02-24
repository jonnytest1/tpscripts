import { evalFncOptions } from './customTypes/declarations';

export interface ASyncForEachType {
    <V extends keyof HTMLElementTagNameMap, T>(options: AsnyForEachOptions<T, V>): any;
}


export interface AsnyForEachOptions<T, V extends keyof HTMLElementTagNameMap> {
    array: Array<T>,
    callback: (item: T, subItem?: HTMLElementTagNameMap[V]) => Promise<boolean | null>,
    delay?: number,
    subItemType?: V,
    subitemOptions?: evalFncOptions
}