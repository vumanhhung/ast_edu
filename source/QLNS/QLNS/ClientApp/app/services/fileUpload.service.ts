import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { FileUploadEnPoint } from './fileUpload-endpoint.service';


@Injectable()
export class FileUploadService {
    constructor(private router: Router, private http: HttpClient, private fileUploadEndpoint: FileUploadEnPoint) {

  }

  deleteImagesbyPath(filename: string[]) {
    return this.fileUploadEndpoint.deleteImagesbyPath<string>(filename);
    }
    deleteImagesbySinglePath(filename: string) {
        return this.fileUploadEndpoint.deleteImagesbySinglePath<string>(filename);
    }
  LoadListFile(idItem: number ,forder:string) {
    return this.fileUploadEndpoint.LoadListFile<any>(idItem, forder);
  }

}
