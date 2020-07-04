import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  } from 'rxjs/operators';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LogEndpoint extends EndpointFactory {
    private readonly _logUrl = "/api/Logs";
    get logUrl() { return this.configurations.baseUrl + this._logUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.logUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders()).catch
            (error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllLog<T>(): Observable<T> {
        return this.http.get(this.logUrl, this.getRequestHeaders()).catch
            (error => {
                return this.handleError(error, () => this.getAllLog());
            });
    }
    getMaxViTri<T>(): Observable<T> {
    let url = `${this.logUrl}/getMaxViTri`;
    return this.http.get(url, this.getRequestHeaders()).catch
      (error => {
        return this.handleError(error, () => this.getMaxViTri());
      });
    }
    getLogByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.logUrl}/${Id}` : this.logUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch
            (error => {
                return this.handleError(error, () => this.getLogByID(Id));
            });
    }
    
    addnewLog<T>(logObject?: any): Observable<T> {
        let body = JSON.stringify(logObject);
        return this.http.post(this.logUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewLog(logObject));
        });
    }
    
    updateLog<T>(id?: number, logObject?: any): Observable<T> {
        let endpointUrl = `${this.logUrl}/${id}`;
        let body = JSON.stringify(logObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateLog(id, logObject));
        });
    }
    
    deleteLog<T>(id: number): Observable<T> {
        let endpointUrl = `${this.logUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders()).catch
            (error => {
                return this.handleError(error, () => this.deleteLog(id));
            });
    }
    
    deleteMoreLog<T>(listId?: any): Observable<T> {
        let endpointUrl = `${this.logUrl}/deleteMore`;
        let body = JSON.stringify(listId);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch
          (error => {
            return this.handleError(error, () => this.deleteMoreLog(listId));
          });
    }
  
    checkExitsItems<T>(value?: any): Observable<T> {
        let endpointUrl = `${this.logUrl}/checkExitsItems`;
        let body = JSON.stringify(value);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch
          (error => {
            return this.handleError(error, () => this.checkExitsItems(value));
          });
    }
}