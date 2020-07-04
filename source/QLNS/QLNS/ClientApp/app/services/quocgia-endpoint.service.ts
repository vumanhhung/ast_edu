import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuocGiaEndpoint extends EndpointFactory {
    private readonly _quocgiaUrl = "/api/QuocGias";
    get quocgiaUrl() { return this.configurations.baseUrl + this._quocgiaUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.quocgiaUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllQuocGia<T>(): Observable<T> {
        return this.http.get(this.quocgiaUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllQuocGia());
            });
    }
    
    getQuocGiaByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.quocgiaUrl}/${Id}` : this.quocgiaUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getQuocGiaByID(Id));
            });
    }
    
    addnewQuocGia<T>(quocgiaObject?: any): Observable<T> {
        let body = JSON.stringify(quocgiaObject);
        return this.http.post(this.quocgiaUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewQuocGia(quocgiaObject));
        });
    }
    
    updateQuocGia<T>(id?: number, quocgiaObject?: any): Observable<T> {
        let endpointUrl = `${this.quocgiaUrl}/${id}`;
        let body = JSON.stringify(quocgiaObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateQuocGia(id, quocgiaObject));
        });
    }
    
    deleteQuocGia<T>(id: number): Observable<T> {
        let endpointUrl = `${this.quocgiaUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteQuocGia(id));
            });
    }
    //hungvm: check vị trí cuối cùng
    getMaxViTri<T>(): Observable<T> {
        let url = `${this.quocgiaUrl}/getMaxViTri`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getMaxViTri());
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreQuocGia<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.quocgiaUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreQuocGia(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.quocgiaUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }
}