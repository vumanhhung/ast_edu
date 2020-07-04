import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TinhThanhEndpoint extends EndpointFactory {
    private readonly _tinhthanhUrl = "/api/TinhThanhs";
    get tinhthanhUrl() { return this.configurations.baseUrl + this._tinhthanhUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.tinhthanhUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllTinhThanh<T>(): Observable<T> {
        return this.http.get(this.tinhthanhUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTinhThanh());
            });
    }
    
    getTinhThanhByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.tinhthanhUrl}/${Id}` : this.tinhthanhUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTinhThanhByID(Id));
            });
    }
    
    addnewTinhThanh<T>(tinhthanhObject?: any): Observable<T> {
        let body = JSON.stringify(tinhthanhObject);
        return this.http.post(this.tinhthanhUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewTinhThanh(tinhthanhObject));
        });
    }
    
    updateTinhThanh<T>(id?: number, tinhthanhObject?: any): Observable<T> {
        let endpointUrl = `${this.tinhthanhUrl}/${id}`;
        let body = JSON.stringify(tinhthanhObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateTinhThanh(id, tinhthanhObject));
        });
    }
    
    deleteTinhThanh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.tinhthanhUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteTinhThanh(id));
            });
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri<T>(): Observable<T> {
        let url = `${this.tinhthanhUrl}/getMaxViTri`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getMaxViTri());
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreTinhThanh<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.tinhthanhUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreTinhThanh(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.tinhthanhUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }
    //hungvm: lấy hết giá trị đc sử dụng
    getAllByStatus<T>(): Observable<T> {
        let endpointUrl = `${this.tinhthanhUrl}/getAllByStatus`;
        return this.http.get(endpointUrl, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getAllByStatus());
            });
    }
}