
import { v4 as uuidv4 } from 'uuid';
export function getSecKey(): string {
    let secKey = localStorage.getItem('secKey');
    if (!secKey) {
        secKey = uuidv4();
        localStorage.setItem('secKey', secKey);
    }
    return secKey;
}

export function getSharedKeys(): Array<string> {
    const keysstr = localStorage.getItem('securityKeys');
    if (!keysstr) {
        return [];
    }
    return JSON.parse(keysstr);
}

export function addSharedKey(key: string): void {
    const keyArray = getSharedKeys();
    keyArray.push(key);
    localStorage.setItem('securityKeys', JSON.stringify(keyArray));
}
