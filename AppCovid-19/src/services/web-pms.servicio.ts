import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ServicioWeb } from './web.service';
import { PRODUCCION } from "../app/ambiente";

@Injectable()
export class ServicioWebPms extends ServicioWeb {

    public gatewayServicio: string;

    // Path redireccionamiento de servicios.
    public pathAsignaciones: string = "/asignaciones/api";
    public pathBusquedas: string = "/busquedas/api";
    public pathCatalogos: string = "/catalogos/api";
    public pathLog4Net: string = "/lognet4/api";
    public pathStorage: string = "/storage/api";
    public pathTickets: string = "/tickets/api";
    public pathUsuarios: string = "/usuarios/api";
    public pathContenido: string = "/contenido/api";

    //-------------------------------------------------------------------------------------------------------------------
    constructor(public http: HttpClient) {
        super(http);
        this.gatewayServicio = PRODUCCION == true ? "http://34.69.220.108" : "http://10.2.15.40:3001";
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición post al servidor pms
    public postAsync(uri: string, objeto: any): Promise<any> {
        return super.postAsync(this.gatewayServicio + uri, objeto);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición get al servidor pms
    public getAsync(uri: string): Promise<any> {
        return super.getAsync(this.gatewayServicio + uri);
    }


}
