import { Injectable } from '@angular/core';
import * as Constants from '../utilities/constants';
import { ServicioWebPms } from './web-pms.servicio';

@Injectable()
export class CatalogosService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private servicioWebPms: ServicioWebPms) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarDependencias(Parametros: any): Promise<any> {
        let url = this.servicioWebPms.pathCatalogos + '/Dependencias/Consultar';
        if (Parametros) {

            let parametrosList: string[] = ['?'];
            if (Parametros.idInstancia) {
                parametrosList.push('IDInstancia=' + Parametros.idInstancia);
            }

            if (Parametros.activo) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('Activo=1');
            }
            if (Parametros.idDependencia) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDDependencia=' + Parametros.idDependencia);
            }
            url = url.concat(parametrosList.join(''));
        }

        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarDependencia(Parametro: any): Promise<any[]> {
        let url = this.servicioWebPms.pathCatalogos + '/Dependencias/Consultar?IDDependencia=' + Parametro;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarTodasDependencias(): Promise<any[]> {
        let url = this.servicioWebPms.pathCatalogos + '/Dependencias/Consultar';
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarServicios(Parametros: any): Promise<any> {
        let url = this.servicioWebPms.pathCatalogos + '/Servicios/Consultar';
        if (Parametros) {
            let parametrosList: string[] = ['?'];
            if (Parametros.idInstancia) {
                parametrosList.push('IDInstancia=' + Parametros.idInstancia);
            }
            if (Parametros.activo) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('Activo=1');
            }
            if (Parametros.idDependencia) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDDependencia=' + Parametros.idDependencia);
            }
            if (Parametros.idServicio) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDServicio=' + Parametros.idServicio);
            }
            url = url.concat(parametrosList.join(''));
        }

        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarSubServicios(Parametros: any): Promise<any> {
        let url = this.servicioWebPms.pathCatalogos + '/SubServicios/Consultar';
        if (Parametros) {
            let parametrosList: string[] = ['?'];
            if (Parametros.idInstancia) {
                parametrosList.push('IDInstancia=' + Parametros.idInstancia);
            }
            if (Parametros.activo) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('Activo=1');
            }
            if (Parametros.idServicio) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDServicio=' + Parametros.idServicio);
            }
            if (Parametros.idSubservicio) {
                if (parametrosList.length > 1) {
                    parametrosList.push('&');
                }
                parametrosList.push('IDSubServicio=' + Parametros.idSubservicio);
            }
            url = url.concat(parametrosList.join(''));
        }

        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarDocumentos(IDInstancia: number, Activo: number) {
        let url = this.servicioWebPms.pathCatalogos + '/Documentos/Consultar?IDInstancia=' + IDInstancia + "&Activo=" + Activo;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarEstados() {
        let tipo = Constants.relEstadoInstancia;
        let url = this.servicioWebPms.pathCatalogos + '/CaEstMun/ConsultaEstado?tipo=' + tipo;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultarMunicipios(idEstado) {
        let tipo = Constants.relMunicipioInstancia;
        let url = this.servicioWebPms.pathCatalogos + '/CaEstMun/ConsultaMunicipios?IDEstado=' + idEstado + '&tipo=' + tipo;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async ConsultaTiposAtencion(idInstancia: number) {
        let url = this.servicioWebPms.pathCatalogos + '/TiposAtencion/Consultar?IDInstancia=' + idInstancia + '&activo=true';
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getInformacion(IDInstancia) {
        let url = this.servicioWebPms.pathBusquedas + '/Contenido/Consultar?idInstancia=' + IDInstancia;
        return await this.servicioWebPms.getAsync(url);
    }
    //#region encuestas
    public async getPreguntasNoTicket(IDEncuesta: number, Actualizacion: boolean) {
        let url = this.servicioWebPms.pathCatalogos + '/Preguntas/Consultar?IDEncuesta=' + IDEncuesta + '&Actualizacion=' + Actualizacion;
        return await this.servicioWebPms.getAsync(url);
    }
    public async getPreguntas(IDEncuesta: number, IDTicket: number, Actualizacion: boolean) {
        let url = this.servicioWebPms.pathCatalogos + '/Preguntas/Consultar?IDEncuesta=' + IDEncuesta + '&IDTicket=' + IDTicket + '&Actualizacion=' + Actualizacion;
        return await this.servicioWebPms.getAsync(url);
    }
    //http://10.2.15.40:3001/catalogos/api/Respuestas/Consultar?IDEncuesta=5
    public async getRespuestas(IDEncuesta: number) {
        let url = this.servicioWebPms.pathCatalogos + '/Respuestas/Consultar?IDEncuesta=' + IDEncuesta;
        return await this.servicioWebPms.getAsync(url);
    }

    public async postEncuesta(cuerpo) {
        let url = this.servicioWebPms.pathAsignaciones + '/Respuesta_Ticket/Guardar';
        return await this.servicioWebPms.postAsync(url, cuerpo);
    }
    public async modificarEncuesta(cuerpo) {
        let url = this.servicioWebPms.pathAsignaciones + '/Respuesta_Ticket/Modificar';
        return await this.servicioWebPms.postAsync(url, cuerpo);
    }
    //http://10.2.15.40:3001/catalogos/api/EvaluacionResultados/Evaluacion?Resultado=7
    public async getResultadoPorSuma(Resultado: number) {
        let url = this.servicioWebPms.pathCatalogos + '/EvaluacionResultados/Evaluacion?Resultado=' + Resultado;
        return await this.servicioWebPms.getAsync(url);
    }
    //http://10.2.15.40:3001/asignaciones/api/Respuesta_Ticket/Consultar?IDTicket=5
    public async getEncuestaXTicket(idTicket): Promise<any[]> {
        let url = this.servicioWebPms.pathAsignaciones + '/Respuesta_Ticket/Consultar?IDTicket=' + idTicket;
        return await this.servicioWebPms.getAsync(url);
    }

    //#endregion

}
