import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { BacLuongEndpoint } from "./bacluong-endpoint.service";
import { BacLuong } from "../models/bacluong.model";
import { AuthService } from './auth.service';



@Injectable()
export class BacLuongService {
    constructor(private router: Router, private http: HttpClient, private bacluongEndpoint: BacLuongEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.bacluongEndpoint.getItems<BacLuong[]>(start, count, whereClause, orderBy);
    }
    
    getAllBacLuong() {
        return this.bacluongEndpoint.getAllBacLuong<BacLuong[]>();
    }

    getBacLuongByID(id?: number) {
        return this.bacluongEndpoint.getBacLuongByID<BacLuong>(id);
    }

    updateBacLuong(id?: number, bacluong?: BacLuong) {
        if (bacluong.bacLuongId) {
            return this.bacluongEndpoint.updateBacLuong(bacluong.bacLuongId, bacluong);
        }
    }

    addnewBacLuong(bacluong?: BacLuong) {
        return this.bacluongEndpoint.addnewBacLuong<BacLuong>(bacluong);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteBacLuong(id: number) {
        return this.bacluongEndpoint.deleteBacLuong(id);
    }

    //hungvm: xóa nhiều row
    deleteMoreBacLuong(listId: number[]) {
        return this.bacluongEndpoint.deleteMoreBacLuong<BacLuong[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.bacluongEndpoint.checkExitsItemsTen<boolean>(value);
    }
}