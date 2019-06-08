
/// <reference path="https://raw.githubusercontent.com/ml5js/ml5-library/development/src/index.js" />
declare interface Window {
    ml5: ml5TypeInfo
}


interface ml5Classifier {
    load: (url: String, callback: () => void) => void
}
interface ml5FeatureExtractor {
    classification: () => ml5Classifier
}

interface ml5TypeInfo {
    featureExtractor: (name: string) => ml5FeatureExtractor
}


interface ml5SpeechCommandRecognizerOptions {
    includeSpectrogram?: boolean
    probabilityThreshold?: number
    invokeCallbackOnNoiseAndUnknown: boolean

    overlapFactor: number;
}
interface ml5SpeechCommandRecognizer {
    ensureModelLoaded: () => Promise<void>
    wordLabels: () => any;

    listen: (callback: (result: any) => void, options: ml5SpeechCommandRecognizerOptions) => void

}
interface ml5SpeechCommands {
    create: (name: string, any: any, modelJson: any, metadataJson: any) => ml5SpeechCommandRecognizer;
}

declare global {
    var speechCommands: ml5SpeechCommands

    var ml5: ml5TypeInfo
}

declare let speechCommands: ml5SpeechCommands

declare let ml5: ml5TypeInfo