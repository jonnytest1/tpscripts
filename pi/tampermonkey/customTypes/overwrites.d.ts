declare interface PromiseConstructor {
    delayed: (millis?: number) => Promise<void>
}


interface XMLHttpRequest {
    requestUrl: string

    whitelisturl: Array<string>
}


declare function navigate(params: string): void