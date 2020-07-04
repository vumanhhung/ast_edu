import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class FileUploadEnPoint extends EndpointFactory {
  private readonly _fileUploadUrl = "/api/FileUploads";
  get fileUploadUrl() { return this.configurations.baseUrl + this._fileUploadUrl; }

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }


  deleteImagesbyPath<T>(filename?: string[]): Observable<T> {
    let endpointUrl = `${this.fileUploadUrl}/RemoveFileByPath`;
    let body = JSON.stringify(filename);
    return this.http.post(endpointUrl, body, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteImagesbyPath(filename));
      }));
    }

    deleteImagesbySinglePath<T>(filename?: string): Observable<T> {
        let endpointUrl = `${this.fileUploadUrl}/RemoveFileBySinglePath`;
        let body = JSON.stringify(filename);
        return this.http.post(endpointUrl, body, this.getRequestHeaders()).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.deleteImagesbySinglePath(filename));
            }));
    }


  LoadListFile<T>(idItem?: number, forder?:string): Observable<T> {
    let endpointUrl = `${this.fileUploadUrl}/LoadListFile/${idItem}`;
    let body = JSON.stringify(forder);
    return this.http.put(endpointUrl,body, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.LoadListFile(idItem, forder));
      }));
  }
}
