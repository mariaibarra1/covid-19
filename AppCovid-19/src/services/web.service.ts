import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ServicioWeb {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(public http: HttpClient) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición post genérica.
    public postAsync(url: string, objeto: any): Promise<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'json' });
        let options = { headers: headers };
        let json = JSON.stringify(objeto);

        return new Promise(resolve => {
            let subs = this.http.post(url, json, options).subscribe(data => {
                // console.log("//- - - - - - - - - - - - - - - - - - - - - - - - -\nrespuesta servicio web POST: " + url);
                // console.log(data);
                subs.unsubscribe();
                return resolve(data);
            }, err => {
                console.error(err);
                subs.unsubscribe();
                return resolve(null);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición get genérica.
    public getAsync(url: string): Promise<any> {

        let headers = new HttpHeaders({ 'responseType': 'text' });
        let options = { headers: headers };

        return new Promise(resolve => {
            let subs = this.http.get(url, options).subscribe(data => {
                // console.log("//- - - - - - - - - - - - - - - - - - - - - - - - -\nrespuesta servicio web GET: " + url);
                // console.log(data);
                subs.unsubscribe();
                return resolve(data);
            }, err => {
                console.error(err);
                subs.unsubscribe();
                return resolve(null);
            });
        });
    }


}