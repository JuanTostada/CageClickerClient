import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

    server = "http://localhost:8080/CageClicker/"
    user = "";
  constructor(private http: Http) {
    this.server = "http://localhost:8080/CageClicker/"
    this.user = "";
  }

  getUser():string {
    return this.user;
  }

  setUser(user: string) {
    this.user = user;
  }

  getServer():string {
    return this.server;
  }

  setServer(server: string) {
    this.server = server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private setHeaders(user : string) : Headers {
    var headers = new Headers();
    headers.append("X-User",user);
    return headers;
  }


  getWorld(): Promise<World> {
 return this.http.get(this.server + "webresources/generic/world")
 .toPromise().then(response =>response.json()).catch(this.handleError);
};


}
