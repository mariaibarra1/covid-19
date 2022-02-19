import { modelCasosTicket } from './../models/modelCasosTicket';
import { Injectable } from "@angular/core";
import { ServicioWebPms } from './web-pms.servicio';

@Injectable()
export class InstanciaService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private servicioWebPms: ServicioWebPms
    ) { }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async setInstanciaLocalStorage(instancia) {
        localStorage.setItem('instancia', JSON.stringify(instancia));
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public getInstanciaLocalStorage() {
        return JSON.parse(localStorage.getItem('instancia'));
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async getInstanciaInfo(IdEstado: number, IdMunicipio: number) {
        let url = this.servicioWebPms.pathCatalogos + '/Instancias/Consultar?IdEstado=' + IdEstado + '&IdMunicipio=' + IdMunicipio;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getInstanciasAsync() {
        let url = this.servicioWebPms.pathCatalogos + '/Instancias/Consultar';
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async setCasosInstancia(casos: modelCasosTicket[]) {
        console.log(casos);
        //casos.forEach(caso => { caso.icon = caso.icon?'custom-' + caso.icon.substring(0, caso.icon.lastIndexOf('.')):''; });
        localStorage.setItem('casos', JSON.stringify(casos));
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async getCasosIntancia() {
        return JSON.parse(localStorage.getItem('casos'));
    }
}

