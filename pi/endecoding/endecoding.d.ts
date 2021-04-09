
interface Encoding {
    nameHTML: string
    fnc: (this: Encoding, str: string, output?: HTMLConvElement) => string
    onchoose?: (queryValue: any) => string
    key?: string
}