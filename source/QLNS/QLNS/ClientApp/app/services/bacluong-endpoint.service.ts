import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class BacLuongEndpoint extends EndpointFactory {
    private readonly _bacluongUrl = "/api/BacLuongs";
    get bacluongUrl() { return this.configurations.baseUrl + this._bacluongUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.bacluongUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllBacLuong<T>(): Observable<T> {
        return this.http.get(this.bacluongUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllBacLuong());
            });
    }
    
    getBacLuongByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.bacluongUrl}/${Id}` : this.bacluongUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getBacLuongByID(Id));
            });
    }
    
    addnewBacLuong<T>(bacluongObject?: any): Observable<T> {
        let body = JSON.stringify(bacluongObject);
        return this.http.post(this.bacluongUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewBacLuong(bacluongObject));
        });
    }
    
    updateBacLuong<T>(id?: number, bacluongObject?: any): Observable<T> {
        let endpointUrl = `${this.bacluongUrl}/${id}`;
        let body = JSON.stringify(bacluongObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateBacLuong(id, bacluongObject));
        });
    }
    
    deleteBacLuong<T>(id: number): Observable<T> {
        let endpointUrl = `${this.bacluongUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteBacLuong(id));
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreBacLuong<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.bacluongUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreBacLuong(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.bacluongUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }
}