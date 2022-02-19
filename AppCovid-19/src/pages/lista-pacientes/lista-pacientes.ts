import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { TicketsService } from '../../services/tickets.service';
import { PacienteModel } from '../../models/paciente.model';
import { DetallePacientePage } from '../detalle-paciente/detalle-paciente';

@IonicPage()
@Component({
  selector: 'page-lista-pacientes',
  templateUrl: 'lista-pacientes.html',
})
export class ListaPacientesPage {

  loggedUser: UsuarioModel;
  listaPacientes: PacienteModel[] = [];
  cargandocontenido: boolean = false;
  avatar: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthenticationService,
    public ticketService: TicketsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPacientesPage');
  }
  async ionViewWillEnter() {
    await this.obtenerIdUsuarioSesion();
  }

  async obtenerIdUsuarioSesion() {
    this.cargandocontenido = true;
    this.listaPacientes = [];
    let user = await this.authService.getUserLocalStorage();
    if (user) {
      this.loggedUser = user;
    } else {
      this.loggedUser.idUsuario = 0;
      this.loggedUser.nombre = '';
    }
    let asociados = await this.ticketService.obtenerPacientesAsociadosXResponsable(this.loggedUser.idUsuario);
    console.log(asociados);

    this.cargandocontenido = false;

    this.listaPacientes = asociados as PacienteModel[];

  }
  detalle(paciente: PacienteModel) {
    console.log('seleccionado detalle');
    console.log(paciente);
    this.navCtrl.push(DetallePacientePage, { detalle: paciente });
  }

}
