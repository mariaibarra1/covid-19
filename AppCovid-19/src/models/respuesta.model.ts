export class RespuestaModel{
    activo: boolean;
    descripcionInstancia: string;
    descripcionPregunta: string;
    descripcionRespuesta: string;
    idInstancia: number;
    idPregunta: number;
    idRespuesta: number;
    ponderacion: number;
    tipo: number;
    constructor(modelo){
        this.activo = modelo.activo?modelo.activo:false;
        this.descripcionInstancia = modelo.descripcionInstancia?modelo.descripcionInstancia:'';
        this.descripcionPregunta = modelo.descripcionPregunta?modelo.descripcionPregunta:'';
        this.descripcionRespuesta = modelo.descripcionRespuesta?modelo.descripcionRespuesta:'';
        this.idInstancia = modelo.idInstancia?modelo.idInstancia:0;
        this.idPregunta = modelo.idPregunta?modelo.idPregunta:0;
        this.idRespuesta = modelo.idRespuesta ? modelo.idRespuesta:0;
        this.ponderacion = modelo.ponderacion?modelo.ponderacion:0;
        this.tipo = modelo.tipo ? modelo.tipo:0;
    }

}