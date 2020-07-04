import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuanHuyenEndpoint extends EndpointFactory {
    private readonly _quanhuyenUrl = "/api/QuanHuyens";
    get quanhuyenUrl() { return this.configurations.baseUrl + this._quanhuyenUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.quanhuyenUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllQuanHuyen<T>(): Observable<T> {
        return this.http.get(this.quanhuyenUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllQuanHuyen());
            });
    }
    
    getQuanHuyenByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.quanhuyenUrl}/${Id}` : this.quanhuyenUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getQuanHuyenByID(Id));
            });
    }
    
    addnewQuanHuyen<T>(quanhuyenObject?: any): Observable<T> {
        let body = JSON.stringify(quanhuyenObject);
        return this.http.post(this.quanhuyenUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewQuanHuyen(quanhuyenObject));
        });
    }
    
    updateQuanHuyen<T>(id?: number, quanhuyenObject?: any): Observable<T> {
        let endpointUrl = `${this.quanhuyenUrl}/${id}`;
        let body = JSON.stringify(quanhuyenObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateQuanHuyen(id, quanhuyenObject));
        });
    }
    
    deleteQuanHuyen<T>(id: number): Observable<T> {
        let endpointUrl = `${this.quanhuyenUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteQuanHuyen(id));
            });
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri<T>(): Observable<T> {
        let url = `${this.quanhuyenUrl}/getMaxViTri`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getMaxViTri());
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreQuanHuyen<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.quanhuyenUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreQuanHuyen(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.quanhuyenUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }

    //hungvm: check tồn tại tỉnh thành
    checkExitsTinhThanh<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.quanhuyenUrl}/checkExistTinhThanh/${value}`;
        return this.http.get(endpointUrl, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsTinhThanh(value));
            });
    }

    //hungvm: get data by status
    getByStatus<T>(): Observable<T> {
        let url = `${this.quanhuyenUrl}/getByStatus`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getByStatus());
            });
    }
}