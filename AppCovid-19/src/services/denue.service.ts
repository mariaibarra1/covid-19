import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
// Servicio API para obtener los sitios registrados en la ciudad de méxico.
export class ServicioDenue {

    public urlSitios = "https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/#condicion/#latitud,#longitud/#metros/fcbe1668-44f0-4830-8854-04071c32240e";

    //-------------------------------------------------------------------------------------------------------------------
    constructor(public http: HttpClient) { }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async obtenerSitiosAsync(lat: number, lng: number, strSitio: string, radio: number): Promise<any> {
        return new Promise<any>(resolve => {
            let url = this.urlSitios.replace("#condicion", strSitio).replace("#latitud", lat.toString())
                .replace("#longitud", lng.toString()).replace("#metros", radio.toString());
            let subs = this.http.get(url).subscribe((resp) => {
                return resolve(resp);
            });
            setTimeout(() => {
                subs.unsubscribe();
                return resolve(null);
            }, 5000)
        });
    }
}



