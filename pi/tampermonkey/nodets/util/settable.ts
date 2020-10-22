
export function settable(target: any, propertyKey: string) {
    if (!target.__setters) {
        target.__setters = [];
    }
    target.__setters.push(propertyKey);
}

export function assign(obj, data) {
    if (obj.__setters) {
        for (let key of obj.__setters) {
            if (key in data) {
                obj[key] = data[key];
            }
        }
    }
}