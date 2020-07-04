import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { TinhThanhEndpoint } from "./tinhthanh-endpoint.service";
import { TinhThanh } from "../models/tinhthanh.model";
import { AuthService } from './auth.service';



@Injectable()
export class TinhThanhService {
    constructor(private router: Router, private http: HttpClient, private tinhthanhEndpoint: TinhThanhEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.tinhthanhEndpoint.getItems<TinhThanh[]>(start, count, whereClause, orderBy);
    }
    
    getAllTinhThanh() {
        return this.tinhthanhEndpoint.getAllTinhThanh<TinhThanh[]>();
    }

    getTinhThanhByID(id?: number) {
        return this.tinhthanhEndpoint.getTinhThanhByID<TinhThanh>(id);
    }

    updateTinhThanh(id?: number, tinhthanh?: TinhThanh) {
        if (tinhthanh.tinhThanhId) {
            return this.tinhthanhEndpoint.updateTinhThanh(tinhthanh.tinhThanhId, tinhthanh);
        }
    }

    addnewTinhThanh(tinhthanh?: TinhThanh) {
        return this.tinhthanhEndpoint.addnewTinhThanh<TinhThanh>(tinhthanh);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteTinhThanh(id: number) {
        return this.tinhthanhEndpoint.deleteTinhThanh(id);
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri() {
        return this.tinhthanhEndpoint.getMaxViTri<TinhThanh>();
    }
    //hungvm: xóa nhiều row
    deleteMoreTinhThanh(listId: number[]) {
        return this.tinhthanhEndpoint.deleteMoreTinhThanh<TinhThanh[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.tinhthanhEndpoint.checkExitsItemsTen<boolean>(value);
    }
    //hungvm: get data by status
    getAllByStatus() {
        return this.tinhthanhEndpoint.getAllByStatus<TinhThanh[]>();
    }
}