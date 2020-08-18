import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ChamCongEndpoint } from "./chamcong-endpoint.service";
import { ChamCong } from "../models/chamcong.model";
import { AuthService } from './auth.service';



@Injectable()
export class ChamCongService {
    constructor(private router: Router, private http: HttpClient, private chamcongEndpoint: ChamCongEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.chamcongEndpoint.getItems<ChamCong[]>(start, count, whereClause, orderBy);
    }
    
    getAllChamCong() {
        return this.chamcongEndpoint.getAllChamCong<ChamCong[]>();
    }

    getChamCongByID(id?: number) {
        return this.chamcongEndpoint.getChamCongByID<ChamCong>(id);
    }

    updateChamCong(id?: number, chamcong?: ChamCong) {
        if (chamcong.chamCongId) {
            return this.chamcongEndpoint.updateChamCong(chamcong.chamCongId, chamcong);
        }
    }

    addnewChamCong(chamcong?: ChamCong) {
        return this.chamcongEndpoint.addnewChamCong<ChamCong>(chamcong);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteChamCong(id: number) {
        return this.chamcongEndpoint.deleteChamCong(id);
    }
    
}