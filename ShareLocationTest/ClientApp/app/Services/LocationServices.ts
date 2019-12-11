import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';  

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LocationServices {
    myAppUrl: string = "";
//    headers: Headers;
  //  options: RequestOptions;
    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.myAppUrl = baseUrl;
     //   let headers = new Headers({ 'Content-Type': 'application/json' });
       // let options = new RequestOptions({ headers: headers });
    }
     

    getAllLocations() {
        return this._http.get(this.myAppUrl + 'api/Location/GetAll')
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    getLocation(id: number) {
        return this._http.get(this.myAppUrl + "api/Location/Get/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    saveLocation(location) {
        return this._http.post(this.myAppUrl + 'api/Location/AddLocation', location)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }
     

    errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}