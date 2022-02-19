export class modelAdjunto {

    constructor() {
        this.guardado = false;
    }

    idAdjunto: number;
    idInstancia: number;
    idTicket: number;
    idDocumento: number;
    idEstatus: number;
    archivo: string;
    ruta: string;
    fechaCreacion: Date;
    guardado: boolean = false;
    uuid: string;
}
