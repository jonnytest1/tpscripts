declare let GM_xmlhttpRequest: (options: GM_Request_Options) => any
declare let GM_notification: Function
declare let GM_getValue: Function
declare let GM_setValue: Function
declare let GM_setClipboard: Function
declare let GM_openInTab: (url: string, options?: GM_openOptions) => WindowLike
declare let GM_addValueChangeListener: (key: string, listner: (key: string, oldV: any, newV: any, from_remote: boolean) => void) => void

interface WindowLike {
    name: string
}

interface GM_openOptions {
    active?: boolean, // decides whether the new tab should be focused

    loadInBackground?: boolean // inverse of active
    insert?: boolean // that inserts the new tab after the current one,

    setParent?: boolean // makes the browser re-focus the current tab on close

    incognito?: boolean //  makes the tab being opened inside a incognito mode/private mode window
}
interface GM_Request_Options {
    url: string
    onload: (response: GM_RequestResponse) => any
    method?: string
    onerror?: Function,
    timeout?: number,
    onabort?: Function
    ontimeout?: Function
    data?: any
    headers?: any,
    synchronous?: boolean
}

interface GM_RequestResponse {
    responseText: string
    status: number
    responseHeaders: string

}