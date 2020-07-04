import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class GioiTinhEndpoint extends EndpointFactory {
    private readonly _gioitinhUrl = "/api/GioiTinhs";
    get gioitinhUrl() { return this.configurations.baseUrl + this._gioitinhUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.gioitinhUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllGioiTinh<T>(): Observable<T> {
        return this.http.get(this.gioitinhUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllGioiTinh());
            });
    }
    
    getGioiTinhByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.gioitinhUrl}/${Id}` : this.gioitinhUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getGioiTinhByID(Id));
            });
    }
    
    addnewGioiTinh<T>(gioitinhObject?: any): Observable<T> {
        let body = JSON.stringify(gioitinhObject);
        return this.http.post(this.gioitinhUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewGioiTinh(gioitinhObject));
        });
    }
    
    updateGioiTinh<T>(id?: number, gioitinhObject?: any): Observable<T> {
        let endpointUrl = `${this.gioitinhUrl}/${id}`;
        let body = JSON.stringify(gioitinhObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateGioiTinh(id, gioitinhObject));
        });
    }
    
    deleteGioiTinh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.gioitinhUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteGioiTinh(id));
            });
    }
    //hungvm: check vị trí cuối cùng
    getMaxViTri<T>(): Observable<T> {
        let url = `${this.gioitinhUrl}/getMaxViTri`;
        return this.http.get(url, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.getMaxViTri());
            });
    }

    //hungvm: xóa nhiều row
    deleteMoreGioiTinh<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.gioitinhUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.deleteMoreGioiTinh(listId));
            });
    }

    //hungvm: check tồn tại
    checkExitsItemsTen<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.gioitinhUrl}/checkExitsItemsTen`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).
            catch(error => {
                return this.handleError(error, () => this.checkExitsItemsTen(value));
            });
    }
}