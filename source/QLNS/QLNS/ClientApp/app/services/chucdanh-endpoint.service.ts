﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ChucDanhEndpoint extends EndpointFactory {
    private readonly _chucdanhUrl = "/api/ChucDanhs";
    get chucdanhUrl() { return this.configurations.baseUrl + this._chucdanhUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.chucdanhUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllChucDanh<T>(): Observable<T> {
        return this.http.get(this.chucdanhUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllChucDanh());
            });
    }
    
    getChucDanhByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.chucdanhUrl}/${Id}` : this.chucdanhUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getChucDanhByID(Id));
            });
    }
    
    addnewChucDanh<T>(chucdanhObject?: any): Observable<T> {
        let body = JSON.stringify(chucdanhObject);
        return this.http.post(this.chucdanhUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewChucDanh(chucdanhObject));
        });
    }
    
    updateChucDanh<T>(id?: number, chucdanhObject?: any): Observable<T> {
        let endpointUrl = `${this.chucdanhUrl}/${id}`;
        let body = JSON.stringify(chucdanhObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateChucDanh(id, chucdanhObject));
        });
    }
    
    deleteChucDanh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.chucdanhUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteChucDanh(id));
            });
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri<T>(): Observable<T> {
        let url = `${this.chucdanhUrl}/getMaxViTri`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getMaxViTri());
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreChucDanh<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.chucdanhUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreChucDanh(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.chucdanhUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }

    //hungvm: get data by status
    getByStatus<T>(): Observable<T> {
        let url = `${this.chucdanhUrl}/getByStatus`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getByStatus());
            });
    }
}