import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { RoleDonViEndpoint } from "./roledonvi-endpoint.service";
import { RoleDonVi } from "../models/roledonvi.model";



@Injectable()
export class RoleDonViService {
    constructor(private router: Router, private http: HttpClient, private roledonviEndpoint: RoleDonViEndpoint) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.roledonviEndpoint.getItems<RoleDonVi[]>(start, count, whereClause, orderBy);
    }   
   
    getAllRoleDonVi() {
        return this.roledonviEndpoint.getAllRoleDonVi<RoleDonVi[]>();
    }

    getRoleDonViByID(id?: number) {
        return this.roledonviEndpoint.getRoleDonViByID<RoleDonVi>(id);
    }

    updateRoleDonVi(id?: number, roledonvi?: RoleDonVi) {
        if (roledonvi.roleDonViId) {
            return this.roledonviEndpoint.updateRoleDonVi(roledonvi.roleDonViId, roledonvi);
        }
    }

    addnewRoleDonVi(roledonvi?: RoleDonVi) {
        return this.roledonviEndpoint.addnewRoleDonVi<RoleDonVi>(roledonvi);
    }  

    deleteRoleDonVi(id: number) {
        return this.roledonviEndpoint.deleteRoleDonVi(id);
    }
    
    deleteMoreRoleDonVi(listId: number[]) {
        return this.roledonviEndpoint.deleteMoreRoleDonVi<RoleDonVi[]>(listId);
    }    
}
