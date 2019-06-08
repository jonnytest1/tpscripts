declare interface Window {
    setups: Array<Function>;

    draws: Array<Function>;

    keyPresseds: Array<Function>;

    mousePresseds: Array<Function>;

    reqT: Function

    buildTrack: Function
}

declare let keyPresseds: Array<Function>;

declare let mousePresseds: Array<Function>;

declare let setups: Array<Function>;

declare let draws: Array<Function>;

//declare let reqT: Function;