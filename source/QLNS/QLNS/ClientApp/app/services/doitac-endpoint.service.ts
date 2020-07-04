import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DoiTacEndpoint extends EndpointFactory {
    private readonly _doitacUrl = "/api/DoiTacs";
    get doitacUrl() { return this.configurations.baseUrl + this._doitacUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.doitacUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllDoiTac<T>(): Observable<T> {
        return this.http.get(this.doitacUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDoiTac());
            });
    }
    
    getDoiTacByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.doitacUrl}/${Id}` : this.doitacUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDoiTacByID(Id));
            });
    }
    
    addnewDoiTac<T>(doitacObject?: any): Observable<T> {
        let body = JSON.stringify(doitacObject);
        return this.http.post(this.doitacUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDoiTac(doitacObject));
        });
    }
    
    updateDoiTac<T>(id?: number, doitacObject?: any): Observable<T> {
        let endpointUrl = `${this.doitacUrl}/${id}`;
        let body = JSON.stringify(doitacObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDoiTac(id, doitacObject));
        });
    }
    
    deleteDoiTac<T>(id: number): Observable<T> {
        let endpointUrl = `${this.doitacUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDoiTac(id));
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreDoiTac<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.doitacUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreDoiTac(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.doitacUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }
}