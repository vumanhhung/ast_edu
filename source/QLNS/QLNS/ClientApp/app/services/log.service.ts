import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { LogEndpoint } from "./log-endpoint.service";
import { Log } from "../models/log.model";



@Injectable()
export class LogService {
    constructor(private router: Router, private http: HttpClient, private logEndpoint: LogEndpoint) {

    }
    
    getItems(start: number, count: number, whereClause: string, orderBy: string) {
        return this.logEndpoint.getItems<Log[]>(start, count, whereClause, orderBy);
    }
    
    getMaxViTri() {
        return this.logEndpoint.getMaxViTri<Log>();
    }
    
    getAllLog() {
        return this.logEndpoint.getAllLog<Log[]>();
    }

    getLogByID(id?: number) {
        return this.logEndpoint.getLogByID<Log>(id);
    }

    updateLog(id?: number, log?: Log) {
        if (log.logID) {
            return this.logEndpoint.updateLog(log.logID, log);
        }
    }

    addnewLog(log?: Log) {
        return this.logEndpoint.addnewLog<Log>(log);
    }  

    deleteLog(id: number) {
        return this.logEndpoint.deleteLog(id);
    }
    
    deleteMoreLog(listId: number[]) {
        return this.logEndpoint.deleteMoreLog<Log[]>(listId);
    }
    checkExitsItems(value?: string) {
        return this.logEndpoint.checkExitsItems<boolean>(value);
    }
    
}