
interface model {
    setWeights: (weights: Array<TensorObject>) => void
    getWeights: () => Array<TensorObject>
    dispose: () => void
    compile: (...args) => void
    predict: (t: TensorObject) => TensorObject

    add: (layer: Layer) => void
}
interface TensorObject {
    toFloat: () => TensorObject
    dispose: () => void
    shape: Array<number>
    reshape: (shape: Array<number>) => TensorObject
    dataSync: () => Array<number>
}
interface TensorInterface {
    (arr: Array<number> | number | Array<Array<number>>, shape?: Array<number>): TensorObject;

}
interface Layer {
    conv2d: (...args) => Layer

    maxPooling2d: (...args) => Layer

    dense: (...args) => Layer

    flatten: (...args) => Layer
}

interface Train {
    sgd: (lr: number) => Train
}
interface Browser {
    fromPixels: (canvas: HTMLCanvasElement) => TensorObject
}
interface tf {
    layers: Layer
    browser: Browser
    setBackend: (be: "cpu") => void
    train: Train,
    tensor1d: TensorInterface
    tensor: TensorInterface
    tensor2d: TensorInterface
    loadLayersModel: (any) => Promise<model>
    tidy: <T>(fn: () => T) => T
    sequential: () => model
}

declare let tf: tf;

declare interface Window {
    NeuralWrapper: any
}