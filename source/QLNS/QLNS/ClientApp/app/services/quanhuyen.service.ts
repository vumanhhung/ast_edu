import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { QuanHuyenEndpoint } from "./quanhuyen-endpoint.service";
import { QuanHuyen } from "../models/quanhuyen.model";
import { AuthService } from './auth.service';



@Injectable()
export class QuanHuyenService {
    constructor(private router: Router, private http: HttpClient, private quanhuyenEndpoint: QuanHuyenEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.quanhuyenEndpoint.getItems<QuanHuyen[]>(start, count, whereClause, orderBy);
    }
    
    getAllQuanHuyen() {
        return this.quanhuyenEndpoint.getAllQuanHuyen<QuanHuyen[]>();
    }

    getQuanHuyenByID(id?: number) {
        return this.quanhuyenEndpoint.getQuanHuyenByID<QuanHuyen>(id);
    }

    updateQuanHuyen(id?: number, quanhuyen?: QuanHuyen) {
        if (quanhuyen.quanHuyenId) {
            return this.quanhuyenEndpoint.updateQuanHuyen(quanhuyen.quanHuyenId, quanhuyen);
        }
    }

    addnewQuanHuyen(quanhuyen?: QuanHuyen) {
        return this.quanhuyenEndpoint.addnewQuanHuyen<QuanHuyen>(quanhuyen);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteQuanHuyen(id: number) {
        return this.quanhuyenEndpoint.deleteQuanHuyen(id);
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri() {
        return this.quanhuyenEndpoint.getMaxViTri<QuanHuyen>();
    }
    //hungvm: xóa nhiều row
    deleteMoreQuanHuyen(listId: number[]) {
        return this.quanhuyenEndpoint.deleteMoreQuanHuyen<QuanHuyen[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.quanhuyenEndpoint.checkExitsItemsTen<boolean>(value);
    }
    //hungvm: check tồn tại tỉnh thành
    checkExitsTinhThanh(value?: number) {
        return this.quanhuyenEndpoint.checkExitsTinhThanh<QuanHuyen[]>(value);
    }

    //hungvm: check tồn tại
    getByStatus() {
        return this.quanhuyenEndpoint.getByStatus<QuanHuyen[]>();
    }
}