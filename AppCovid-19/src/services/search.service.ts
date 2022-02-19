import { TicketModel } from './../models/ticket.model';
import { Injectable } from '@angular/core';
import { BusquedaModel } from '../models/busqueda.model';
import { ServicioWebPms } from './web-pms.servicio';
import { AvisoModel } from '../models/aviso.model';

@Injectable()
export class SearchService {

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private servicioWebPms: ServicioWebPms) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async searchDependencia(search: string): Promise<BusquedaModel> {
    let url = this.servicioWebPms.pathBusquedas + '/Busqueda/Consultar?DescripcionDependencia=' + search;
    return await this.servicioWebPms.getAsync(url);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async searchTickets(folio): Promise<TicketModel> {
    let url = this.servicioWebPms.pathBusquedas + '/api/TicketBusqueda/Consultar?Folio=' + folio;
    return await this.servicioWebPms.getAsync(url);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async searchAvisos(instancia: number): Promise<AvisoModel[][]> {
    let url = this.servicioWebPms.pathBusquedas + '/Contenido/Consultar?IdClasificacion=1&idInstancia=' + instancia;
    return await this.servicioWebPms.getAsync(url);
  }
}