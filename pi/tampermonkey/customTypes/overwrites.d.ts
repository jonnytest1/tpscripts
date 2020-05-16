declare interface PromiseConstructor {
    delayed: (amount?: number) => Promise<void>
}


declare function navigate(params: string): void