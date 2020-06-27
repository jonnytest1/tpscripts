declare interface PromiseConstructor {
    delayed: (millis?: number) => Promise<void>
}


declare function navigate(params: string): void