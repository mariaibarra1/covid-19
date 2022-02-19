import { modelTickets } from './../models/modelTickets';
import { modelAdjunto } from './../models/modelAdjunto';
import { modelEstatus } from './../models/modelEstatus';
import { Injectable } from "@angular/core";
import { ServicioWebPms } from './web-pms.servicio';

@Injectable()
export class TicketsService {

    constructor(
        private servicioWebPms: ServicioWebPms
    ) { }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async obtenerTicketActualResponsable(idUsuario) {
        let url = this.servicioWebPms.pathBusquedas + '/BandejaCiudadano/ConsultarResponsable?IDUsuario=' + idUsuario;
        let tickets = await this.servicioWebPms.getAsync(url);
        console.log("tickets");
        console.log(tickets);

        if (tickets == null || tickets.length == 0) {
            return null;
        }

        // Ticket actual del usuario.
        return tickets.find(ticket => ticket.cerrado == false);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async obtenerTicketActualUsuario(idUsuario) {
        let tickets = await this.getAllTickets(idUsuario);
        console.log("tickets");
        console.log(tickets);

        if (tickets == null || tickets.length == 0) {
            return null;
        }

        // Ticket actual del usuario.
        return tickets.find(ticket => ticket.cerrado == false);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async SaveTicket(ticket: modelTickets): Promise<any> {
        let url = this.servicioWebPms.pathTickets + '/Tickets/GuardarConsultar';
        return await this.servicioWebPms.postAsync(url, ticket);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async updateTicket(ticket: modelTickets) {
        let url = this.servicioWebPms.pathTickets + '/Tickets/Modificar';
        return await this.servicioWebPms.postAsync(url, ticket);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getAllTickets(idUsuario: number) {
        let url = this.servicioWebPms.pathBusquedas + '/BandejaCiudadano/Consultar?IDUsuario=' + idUsuario;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getTicket(Parametros: modelTickets = null): Promise<any> {
        let url = this.servicioWebPms.pathTickets + '/Tickets/Consultar';
        if (Parametros) {
            let parametrosList: string[] = ['?'];
            if (Parametros.idTicket) {
                parametrosList.push('IDTicket=' + Parametros.idTicket);
            }
            url = url.concat(parametrosList.join(''));
        }

        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getStatusTicket(idTicket: number): Promise<any> {
        let url = this.servicioWebPms.pathTickets + '/Tickets/Estatus/Consultar?IDTicket=' + idTicket;
        return (await this.servicioWebPms.getAsync(url))[0];
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getStatusList(Parametros: modelEstatus = null) {
        let url = this.servicioWebPms.pathCatalogos + '/Estatus/Consultar';

        if (Parametros) {
            let parametrosList: string[] = ['?'];
            if (Parametros.idInstancia) {
                parametrosList.push('IDInstancia=' + Parametros.idInstancia);
            }
            if (Parametros.activo) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('Activo=' + Parametros.activo);
            }
            if (Parametros.idCaso) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDCaso=' + Parametros.idCaso);
            }
            if (Parametros.nivel) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('Nivel=' + Parametros.nivel);
            }
            url = url.concat(parametrosList.join(''));
        }

        return await this.servicioWebPms.getAsync(url);

    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getComments(idTicket: number) {
        let url = this.servicioWebPms.pathTickets + '/Tickets/Comentario/Consultar?IDTicket=' + idTicket;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getEvidences(Parametros: modelAdjunto = null): Promise<any> {
        let url = this.servicioWebPms.pathStorage + '/Storage/ConsultarAdjuntos';
        if (Parametros) {
            let parametrosList: string[] = ['?'];
            if (Parametros.idTicket) {
                parametrosList.push('IDTicket=' + Parametros.idTicket);
            }
            url = url.concat(parametrosList.join(''));
        }
        return await this.servicioWebPms.getAsync(url);
    }
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    public async obtenerPacientesAsociadosXResponsable(IdResponsable: number): Promise<any[]> {
        let payload = { "idUsuario": IdResponsable }
        let url = this.servicioWebPms.pathTickets + '/Tickets/Responsable/Consultar';
        return await this.servicioWebPms.postAsync(url, payload);
    }


}