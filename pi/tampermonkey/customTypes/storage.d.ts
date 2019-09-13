interface CustomStorage {
    g: (identifier, standard) => any;
    s: (identifier, value) => void;
    p: (identifier, object, standard?) => void

    remove?: (identfier: string, filterFunction: Function, standard?: any) => void;

    filter?: <T> (identfier: string, filterFunction: (element: T) => boolean) => Array<T>;
}