import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DonViEndpoint } from "./donvi-endpoint.service";
import { DonVi } from "../models/donvi.model";
import { AuthService } from './auth.service';



@Injectable()
export class DonViService {
    constructor(private router: Router, private http: HttpClient, private donviEndpoint: DonViEndpoint) {

    }

    getDonViByRole(userId: string) {
        return this.donviEndpoint.getDonViByRole<DonVi[]>(userId);
    }

    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.donviEndpoint.getItems<DonVi[]>(start, count, whereClause, orderBy);
    }

    getAllDonVi() {
        return this.donviEndpoint.getAllDonVi<DonVi[]>();
    }

    getDonViByID(id?: number) {
        return this.donviEndpoint.getDonViByID<DonVi>(id);
    }

    updateDonVi(id?: number, donvi?: DonVi) {
        if (donvi.donViId) {
            return this.donviEndpoint.updateDonVi(donvi.donViId, donvi);
        }
    }

    addnewDonVi(donvi?: DonVi) {
        return this.donviEndpoint.addnewDonVi<DonVi>(donvi);
    }

    deleteDonVi(id: number) {
        return this.donviEndpoint.deleteDonVi(id);
    }

    checkExitsItems(value?: string, maDonViCha?: string) {
        return this.donviEndpoint.checkExitsItems<boolean>(value, maDonViCha);
    }

}