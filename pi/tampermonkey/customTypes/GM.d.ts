declare let GM_xmlhttpRequest: (options: GM_Request_Options) => any
declare let GM_notification: Function
declare let GM_getValue: Function
declare let GM_setValue: Function
declare let GM_setClipboard: Function

interface GM_Request_Options {
    url: string
    onload: (response: GM_RequestResponse) => any
    method?: string
    onerror?: Function,
    timeout?: number,
    onabort?: Function
    ontimeout?: Function
    data?: any
    headers?: any
}

interface GM_RequestResponse {
    responseText: string
    status: number
    responseHeaders: string

}