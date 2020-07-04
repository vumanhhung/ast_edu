import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class RoleDonViEndpoint extends EndpointFactory {
    private readonly _roledonviUrl = "/api/RoleDonVis";
    get roledonviUrl() { return this.configurations.baseUrl + this._roledonviUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.roledonviUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders()).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            }));
    }
    
    getAllRoleDonVi<T>(): Observable<T> {
        return this.http.get(this.roledonviUrl, this.getRequestHeaders()).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getAllRoleDonVi());
            }));
    }
    
    getRoleDonViByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.roledonviUrl}/${Id}` : this.roledonviUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getRoleDonViByID(Id));
            }));
    }
    
    addnewRoleDonVi<T>(roledonviObject?: any): Observable<T> {
        let body = JSON.stringify(roledonviObject);
        return this.http.post(this.roledonviUrl, body, this.getRequestHeaders()).pipe<T>(catchError(error => {
            return this.handleError(error, () => this.addnewRoleDonVi(roledonviObject));
        }));
    }
    
    updateRoleDonVi<T>(id?: number, roledonviObject?: any): Observable<T> {
        let endpointUrl = `${this.roledonviUrl}/${id}`;
        let body = JSON.stringify(roledonviObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).pipe<T>(catchError(error => {
            return this.handleError(error, () => this.updateRoleDonVi(id, roledonviObject));
        }));
    }
    
    deleteRoleDonVi<T>(id: number): Observable<T> {
        let endpointUrl = `${this.roledonviUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders()).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.deleteRoleDonVi(id));
            }));
    }
    
    deleteMoreRoleDonVi<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.roledonviUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).pipe<T>(
          catchError(error => {
            return this.handleError(error, () => this.deleteMoreRoleDonVi(listId));
          }));
    } 
    
}
