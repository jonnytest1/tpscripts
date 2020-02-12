

declare function getter(identfier: string, standard: boolean): boolean
declare function getter<T>(identifier: string, standard: T): T;



interface CustomStorage {

    g: typeof getter;
    s: (identifier, value) => void;
    p: (identifier, object, standard?) => void

    remove?: (identfier: string, filterFunction: Function, standard?: any) => void;

    filter?: <T> (identfier: string, filterFunction: (element: T) => boolean) => Array<T>;

    setValue;
}