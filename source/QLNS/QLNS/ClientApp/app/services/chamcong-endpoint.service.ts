import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ChamCongEndpoint extends EndpointFactory {
    private readonly _chamcongUrl = "/api/ChamCongs";
    get chamcongUrl() { return this.configurations.baseUrl + this._chamcongUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.chamcongUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllChamCong<T>(): Observable<T> {
        return this.http.get(this.chamcongUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllChamCong());
            });
    }
    
    getChamCongByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.chamcongUrl}/${Id}` : this.chamcongUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getChamCongByID(Id));
            });
    }
    
    addnewChamCong<T>(chamcongObject?: any): Observable<T> {
        let body = JSON.stringify(chamcongObject);
        return this.http.post(this.chamcongUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewChamCong(chamcongObject));
        });
    }
    
    updateChamCong<T>(id?: number, chamcongObject?: any): Observable<T> {
        let endpointUrl = `${this.chamcongUrl}/${id}`;
        let body = JSON.stringify(chamcongObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateChamCong(id, chamcongObject));
        });
    }
    
    deleteChamCong<T>(id: number): Observable<T> {
        let endpointUrl = `${this.chamcongUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteChamCong(id));
            });
    }
}