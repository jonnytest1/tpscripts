import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Receiver, Sender } from './interfaces';

@Injectable({ providedIn: 'root' })
export class SettingsService {

    constructor(private http: HttpClient) {

    }


    getSenders() {
        return this.http.get<Array<Sender>>(environment.prefixPath + 'rest/sender');
    }

    getReceivers() {
        return this.http.get<Array<Receiver>>(environment.prefixPath + 'rest/receiver');
    }
}
