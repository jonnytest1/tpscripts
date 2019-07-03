interface EventMap{
    'install':any;

    'fetch':FetchEvent;

    'message':any

    notificationclick:any
}

interface ServiceWorkerType{
    registration:ServiceWorkerRegistration

    addEventListener:ListenerFunction
}

interface FetchEventRequest{
    url:String;
}
interface FetchEvent{
    request:FetchEventRequest
    respondWith:(response:Response)=>void;
}

export interface ListenerFunction {
    <K extends keyof EventMap>(path:K,callback:(event:EventMap[K])=>any,something?:boolean):void;
}