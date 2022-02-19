export class EncuestaSubmit {

    idTicket: number;
    idPregunta: number;
    idRespuesta: number;
    idEncuesta: number;
    ponderacion: number;
    IdUsuario: number;
    Resultado: number;
    IdResultado: number;
    IdResultEncuesta: number;
    idPr: number;

    constructor(modelo) {
        this.idTicket = modelo.idTicket ? modelo.idTicket : 0;
        this.idPregunta = modelo.idPregunta ? modelo.idPregunta : 0;
        this.idRespuesta = modelo.idRespuesta ? modelo.idRespuesta : 0;
        this.idEncuesta = modelo.idEncuesta ? modelo.idEncuesta : 0;
        this.ponderacion = modelo.ponderacion ? modelo.ponderacion : 0;
        this.IdResultado = modelo.IdResultado ? modelo.IdResultado : 0;
        this.idPr = modelo.idPr ? modelo.idPr : 0;
    }
}