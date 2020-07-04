import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DonViEndpoint extends EndpointFactory {
    private readonly _donviUrl = "/api/DonVis";
    get donviUrl() { return this.configurations.baseUrl + this._donviUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getDonViByRole<T>(userId: string): Observable<T> {
        let url = `${this.donviUrl}/getDonViByRole/${userId}`;
        //let body = JSON.stringify(userId);
        return this.http.get(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDonViByRole(userId));
            });
    }

    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.donviUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }

    getAllDonVi<T>(): Observable<T> {
        return this.http.get(this.donviUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDonVi());
            });
    }

    getDonViByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.donviUrl}/${Id}` : this.donviUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDonViByID(Id));
            });
    }

    addnewDonVi<T>(donviObject?: any): Observable<T> {
        let body = JSON.stringify(donviObject);
        return this.http.post(this.donviUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDonVi(donviObject));
        });
    }

    updateDonVi<T>(id?: number, donviObject?: any): Observable<T> {
        let endpointUrl = `${this.donviUrl}/${id}`;
        let body = JSON.stringify(donviObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDonVi(id, donviObject));
        });
    }

    deleteDonVi<T>(id: number): Observable<T> {
        let endpointUrl = `${this.donviUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDonVi(id));
            });
    }

    checkExitsItems<T>(value?: string, maDonViCha?: string): Observable<T> {
        let endpointUrl = `${this.donviUrl}/checkExitsItems`;
        let body = JSON.stringify(value + "," + maDonViCha);
        return this.http.put(endpointUrl, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.checkExitsItems(value, maDonViCha));
            });
    }
}