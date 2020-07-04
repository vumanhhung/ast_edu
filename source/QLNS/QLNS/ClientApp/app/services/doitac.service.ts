import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DoiTacEndpoint } from "./doitac-endpoint.service";
import { DoiTac } from "../models/doitac.model";
import { AuthService } from './auth.service';



@Injectable()
export class DoiTacService {
    constructor(private router: Router, private http: HttpClient, private doitacEndpoint: DoiTacEndpoint, private authService: AuthService) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.doitacEndpoint.getItems<DoiTac[]>(start, count, whereClause, orderBy);
    }
    
    getAllDoiTac() {
        return this.doitacEndpoint.getAllDoiTac<DoiTac[]>();
    }

    getDoiTacByID(id?: number) {
        return this.doitacEndpoint.getDoiTacByID<DoiTac>(id);
    }

    updateDoiTac(id?: number, doitac?: DoiTac) {
        if (doitac.doiTacId) {
            return this.doitacEndpoint.updateDoiTac(doitac.doiTacId, doitac);
        }
    }

    addnewDoiTac(doitac?: DoiTac) {
        return this.doitacEndpoint.addnewDoiTac<DoiTac>(doitac);
    }    

    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }

    deleteDoiTac(id: number) {
        return this.doitacEndpoint.deleteDoiTac(id);
    }

    //hungvm: xóa nhiều row
    deleteMoreDoiTac(listId: number[]) {
        return this.doitacEndpoint.deleteMoreDoiTac<DoiTac[]>(listId);
    }
    //hungvm: check tồn tại
    checkExitsItems(value?: string) {
        return this.doitacEndpoint.checkExitsItemsTen<boolean>(value);
    }
}