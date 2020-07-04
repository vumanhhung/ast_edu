import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { QuocGiaEndpoint } from "./quocgia-endpoint.service";
import { QuocGia } from "../models/quocgia.model";
import { AuthService } from './auth.service';



@Injectable()
export class QuocGiaService {
    constructor(private router: Router, private http: HttpClient, private quocgiaEndpoint: QuocGiaEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.quocgiaEndpoint.getItems<QuocGia[]>(start, count, whereClause, orderBy);
    }
    
    getAllQuocGia() {
        return this.quocgiaEndpoint.getAllQuocGia<QuocGia[]>();
    }

    getQuocGiaByID(id?: number) {
        return this.quocgiaEndpoint.getQuocGiaByID<QuocGia>(id);
    }

    updateQuocGia(id?: number, quocgia?: QuocGia) {
        if (quocgia.quocGiaId) {
            return this.quocgiaEndpoint.updateQuocGia(quocgia.quocGiaId, quocgia);
        }
    }

    addnewQuocGia(quocgia?: QuocGia) {
        return this.quocgiaEndpoint.addnewQuocGia<QuocGia>(quocgia);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteQuocGia(id: number) {
        return this.quocgiaEndpoint.deleteQuocGia(id);
    }

    //hungvm: check vị trí cuối cùng
    getMaxViTri() {
        return this.quocgiaEndpoint.getMaxViTri<QuocGia>();
    }
    //hungvm: xóa nhiều row
    deleteMoreQuocGia(listId: number[]) {
        return this.quocgiaEndpoint.deleteMoreQuocGia<QuocGia[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.quocgiaEndpoint.checkExitsItemsTen<boolean>(value);
    }
}