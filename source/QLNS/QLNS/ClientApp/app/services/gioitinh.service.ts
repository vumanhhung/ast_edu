import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { GioiTinhEndpoint } from "./gioitinh-endpoint.service";
import { GioiTinh } from "../models/gioitinh.model";
import { AuthService } from './auth.service';



@Injectable()
export class GioiTinhService {
    constructor(private router: Router, private http: HttpClient, private gioitinhEndpoint: GioiTinhEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.gioitinhEndpoint.getItems<GioiTinh[]>(start, count, whereClause, orderBy);
    }
    
    getAllGioiTinh() {
        return this.gioitinhEndpoint.getAllGioiTinh<GioiTinh[]>();
    }

    getGioiTinhByID(id?: number) {
        return this.gioitinhEndpoint.getGioiTinhByID<GioiTinh>(id);
    }

    updateGioiTinh(id?: number, gioitinh?: GioiTinh) {
        if (gioitinh.gioiTinhId) {
            return this.gioitinhEndpoint.updateGioiTinh(gioitinh.gioiTinhId, gioitinh);
        }
    }

    addnewGioiTinh(gioitinh?: GioiTinh) {
        return this.gioitinhEndpoint.addnewGioiTinh<GioiTinh>(gioitinh);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteGioiTinh(id: number) {
        return this.gioitinhEndpoint.deleteGioiTinh(id);
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri() {
        return this.gioitinhEndpoint.getMaxViTri<GioiTinh>();
    }
    //hungvm: xóa nhiều row
    deleteMoreGioiTinh(listId: number[]) {
        return this.gioitinhEndpoint.deleteMoreGioiTinh<GioiTinh[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.gioitinhEndpoint.checkExitsItemsTen<boolean>(value);
    }
}