export class modelTicketComentario {

    constructor() {
        this.guardado = false;
    }

    idTComentario: number;
    idTicket: number;
    comentario: string;
    guardado: boolean = false;
}