export interface Sender {
    id: string,
    name: string,
    description: string,

    connections?: Array<Connection>
}

export interface Connection {

    id: string
    receiver: Receiver
}

export interface Receiver {
    id: string,
    name: string,
    description: string
}