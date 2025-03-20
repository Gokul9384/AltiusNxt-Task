import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonHelper } from '../Helper/CommonHelper';
import { DateFormat } from 'src/Helper/DateFormat';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private httpClient: HttpClient, private helper: CommonHelper) {

  }

  public GetAll(UrlName: string) {
    return this.httpClient.get<any>(`${this.helper.ApiURL}/${UrlName}`).toPromise<any>();
  }

  public GetById(id: number, UrlName: string) {
    return this.httpClient.get<any>(`${this.helper.ApiURL}/${UrlName}/${id}`).toPromise<any>();
  }

  public CommonPost(model: any, UrlName: string) {
    return this.httpClient.post(`${this.helper.ApiURL}/${UrlName}`, Object.assign({}, model)).toPromise<any>();
  }

  public CommonPut(model: any, UrlName: string) {
    return this.httpClient.put(`${this.helper.ApiURL}/${UrlName}`, Object.assign({}, model)).toPromise<any>();
  }

  public CommonPatch(model: any, UrlName: string) {
    return this.httpClient.patch(`${this.helper.ApiURL}/${UrlName}`, Object.assign(Array.isArray(model) ? [] : {}, model)).toPromise<any>();
  }

  // public Delete(id: number, UrlName: string) {
  //   return this.httpClient.get(`${this.helper.ApiURL}/${UrlName}/${id}`).toPromise();
  // }
  public Delete(UrlName: string) {
    return this.httpClient.delete(`${this.helper.ApiURL}/${UrlName}`).toPromise<any>();
  }
  
}

