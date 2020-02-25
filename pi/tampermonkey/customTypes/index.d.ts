
/// <reference path="./declarations.d.ts" />
/// <reference path="./DOM.d.ts" />
/// <reference path="./p5_types.d.ts" />
/// <reference path="./p5a.d.ts" />

/// <reference path="./physics.d.ts" /> 
/// <reference path="./GM.d.ts" />

/// <reference path="../learning/tensorflow.js" />


/// <reference path="../BASE.js" />




interface EvalSSCripts {
    [key: string]: any
}

interface Document {
    props: {
        evalScripts: EvalSSCripts
    }
}

declare const IMPORT: any

