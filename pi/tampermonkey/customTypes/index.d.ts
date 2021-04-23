
/// <reference path="./declarations.d.ts" />
/// <reference path="./DOM.d.ts" />
/// <reference path="./p5_types.d.ts" />
/// <reference path="./p5a.d.ts" />

/// <reference path="./physics.d.ts" /> 
/// <reference path="./GM.d.ts" />
/// <reference path="./colors.d.ts" />

/// <reference path="../learning/tensorflow.js" />
/// <reference path="./overwrites.d.ts" />
/// <reference path="../BASE.js" />

type CustomEvalScript = CustomScript & {
    resolvers?: Array<Function>,
    dispatchEvent: Function,
    addEventListener: Function,
    remove: Function,
    parameters?: { [key: string]: any }
}


interface EvalSSCripts {
    [key: string]: CustomEvalScript
}

interface Document {
    props: {
        evalScripts: EvalSSCripts
        canInject: boolean
        canInjectText: boolean
    }
}

declare const IMPORT: any

