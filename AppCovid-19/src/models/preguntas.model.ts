export class PreguntasModel{
    idPregunta: number;
    idInstancia: number;
    idEncuesta: number;
    descripcionPregunta: string;
    descripcionInstancia: string;
    descripcionEncuesta: string;
    activo: boolean;
    tipoRespuesta: number;
    idTicket: number;
    existe: number;
    constructor(modelo){
        this.idPregunta = modelo.idPregunta?modelo.idPregunta:0;
        this.idInstancia = modelo.idInstancia?modelo.idInstancia:0;
        this.idEncuesta = modelo.idEncuesta?modelo.idEncuesta:0;
        this.descripcionEncuesta = modelo.descripcionEncuesta?modelo.descripcionEncuesta:'';
        this.descripcionPregunta = modelo.descripcionPregunta?modelo.descripcionPregunta:'';
        this.descripcionInstancia = modelo.descripcionInstancia?modelo.descripcionInstancia:'';
        this.activo = modelo.activo?modelo.activo:false;
        this.tipoRespuesta = modelo.tipoRespuesta?modelo.tipoRespuesta:0;
        this.idTicket = modelo.idTicket?modelo.idTicket:0;
        this.existe = modelo.existe?modelo.existe:0;
    }

}