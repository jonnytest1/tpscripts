import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { enc, AES } from 'crypto-js';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService {


    private readonly errorImg = 'data:image/png;base64,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';


    secKey;
    constructor(private http: HttpClient) {
    }
    remove(id: number) {
        return this.http.post('https://pi4.e6azumuvyiabvs9s.myfritz.net/tm/libs/imagestore/delete.php', id);
    }
    psotImage(image: string) {
        return this.http.post('https://pi4.e6azumuvyiabvs9s.myfritz.net/tm/libs/imagestore/upload.php', this.encrypt(image));
    }

    getFiles() {
        return this.http.get('https://pi4.e6azumuvyiabvs9s.myfritz.net/tm/libs/imagestore')
            .pipe(
                map((files: Array<{ b64: string, id: number }>) => files.map(file => {
                    let b64;
                    let id = file[0];
                    try {
                        b64 = this.decrypt(file[1]);
                    } catch (e) {
                        b64 = this.errorImg;
                        id = -1;
                    }
                    return ({
                        b64,
                        id
                    });
                })));
    }


    encrypt(b64: string): string {
        this.secKey = localStorage.getItem('secKey');
        if (!this.secKey) {
            this.secKey = uuidv4();
            localStorage.setItem('secKey', this.secKey);
        }
        return AES.encrypt(b64, this.secKey).toString();
    }

    decrypt(aes: string): string {
        this.secKey = localStorage.getItem('secKey');
        if (!this.secKey) {
            this.secKey = uuidv4();
            localStorage.setItem('secKey', this.secKey);
        }
        return AES.decrypt(aes, this.secKey).toString(enc.Utf8);
    }
}
