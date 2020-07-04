import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ChucDanhEndpoint } from "./chucdanh-endpoint.service";
import { ChucDanh } from "../models/chucdanh.model";
import { AuthService } from './auth.service';



@Injectable()
export class ChucDanhService {
    constructor(private router: Router, private http: HttpClient, private chucdanhEndpoint: ChucDanhEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.chucdanhEndpoint.getItems<ChucDanh[]>(start, count, whereClause, orderBy);
    }
    
    getAllChucDanh() {
        return this.chucdanhEndpoint.getAllChucDanh<ChucDanh[]>();
    }

    getChucDanhByID(id?: number) {
        return this.chucdanhEndpoint.getChucDanhByID<ChucDanh>(id);
    }

    updateChucDanh(id?: number, chucdanh?: ChucDanh) {
        if (chucdanh.chucDanhId) {
            return this.chucdanhEndpoint.updateChucDanh(chucdanh.chucDanhId, chucdanh);
        }
    }

    addnewChucDanh(chucdanh?: ChucDanh) {
        return this.chucdanhEndpoint.addnewChucDanh<ChucDanh>(chucdanh);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteChucDanh(id: number) {
        return this.chucdanhEndpoint.deleteChucDanh(id);
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri() {
        return this.chucdanhEndpoint.getMaxViTri<ChucDanh>();
    }
    //hungvm: xóa nhiều row
    deleteMoreChucDanh(listId: number[]) {
        return this.chucdanhEndpoint.deleteMoreChucDanh<ChucDanh[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.chucdanhEndpoint.checkExitsItemsTen<boolean>(value);
    }

    //hungvm: check tồn tại
    getByStatus() {
        return this.chucdanhEndpoint.getByStatus<ChucDanh[]>();
    }
}