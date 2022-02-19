import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComentarioTicket } from '../../models/comentarioTicket.model';
import { TicketsService } from '../../services/tickets.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { TicketModel } from '../../models/ticket.model';
import { modelTicketComentario } from '../../models/modelTicketComentario';
import { ComentariosDetallePage } from './comentarios-detalle/comentarios-detalle';

@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',
})
export class ComentariosPage {

  public comentarios: Array<ComentarioTicket> = [];
  public contenidoCargado: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ticketsService: TicketsService,
    private authenticationService: AuthenticationService) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewDidEnter() {
    await this.obtenerComentarios();
    this.contenidoCargado = true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async refrescar(refresher) {
    await this.obtenerComentarios()
    refresher.complete();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerComentarios() {
    let user: UsuarioModel = await this.authenticationService.getUserLocalStorage();
    console.log("user");
    console.log(user);
    let ticket: TicketModel = await this.ticketsService.obtenerTicketActualUsuario(user.idUsuario);
    console.log("ticket");
    console.log(ticket);
    if (ticket == null)
      return;
    let comentarios = await this.ticketsService.getComments(ticket.idTicket);
    if (comentarios != null && comentarios.length > 0)
      this.comentarios = comentarios;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public pantallaDetalle(comentario: modelTicketComentario) {
    this.navCtrl.push(ComentariosDetallePage, { comentario: comentario });
  }

}
