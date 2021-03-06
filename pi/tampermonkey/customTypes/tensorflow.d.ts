
interface model {
    setWeights: (weights: Array<TensorObject>) => void
    getWeights: () => Array<TensorObject>
    dispose: () => void
    compile: (options: tfCompileOptions, ...args) => void
    predict: (t: TensorObject) => TensorObject;

    fit: (x: TensorObject, y: TensorObject, fitOptions?: fitOptions) => Promise<fitHistory>;// returns History
    add: (layer: Layers) => tfLayer
}

interface Optimizer {

}

interface tfCompileOptions {
    optimizer?: Optimizer,
    loss?: "categoricalCrossentropy",
    metrics?: Array<"accuracy">
}
interface fitReport {
    acc: Array<number>,
    loss: Array<number>
}
interface fitHistory {
    epoch: Array<number>
    params: any
    history: fitReport
}

interface fitOptions {
    epochs?: number
    batchSize?: number

    callbacks?: {
        onEpochEnd?: Function
        onBatchBegin?: Function
        onBatchEnd?: Function
    }

    validationSplit?: number
}

interface TensorObject {
    toFloat: () => TensorObject
    dispose: () => void
    shape: Array<number>
    reshape: (shape: Array<number>) => TensorObject
    dataSync: () => Array<number>
    clone: () => TensorObject
    data: () => Promise<Array<number>>
}
interface TensorInterface {
    (arr: number |
        Array<number> |
        Array<Array<number>> |
        Array<Array<Array<number>>> |
        Array<Array<Array<Array<number>>>>, shape?: Array<number>): TensorObject;

}

interface LayerOptions {
    inputShape?: Array<number>
    units?: number

    strides?: number | Array<number>
    poolSize?: Array<number>
    filters?: number
    kernelSize?: number
    kernelInitializer?: 'VarianceScaling'
    activation?: 'sigmoid' | 'relu'

    useBias?: boolean
}
interface Layer {
    type: String
    options: LayerOptions
}
interface Layers {
    conv2d: (...args) => Layers

    maxPooling2d: (...args) => Layers

    dense: (...args) => Layers

    flatten: (...args) => Layers
}

interface Train {
    sgd: (lr: number) => Train

    adam: () => Optimizer
}
interface Browser {
    fromPixels: (canvas: HTMLCanvasElement) => TensorObject
}

interface tfLayer {

}
interface tf {
    layers: Layers
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