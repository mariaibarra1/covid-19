import { UsuarioModel } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServicioWebPms } from './web-pms.servicio';
import { TokenSesionModel } from '../models/token-sesion.model';
import * as Constants from '../utilities/constants';
import { UsuarioRegistroModel } from '../models/usuario-registro.model';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthenticationService {
  private authenticationState = new BehaviorSubject(false);

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private servicioWebPms: ServicioWebPms,
    private events: Events) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async login(email: string, contrasenia: string): Promise<any> {
    let login = {
      "email": email,
      "contrasenia": contrasenia
    }

    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/Login';
    let response = await this.servicioWebPms.postAsync(url, login);
    console.log(response);
    if (response != Constants.errorConexion) {
      let tokenObject = response as TokenSesionModel;
      if (tokenObject.token.length != 0) {
        this.authenticationState.next(true);
      }
    }

    return response;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async resetPassword(email: string): Promise<boolean> {
    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/Restablecer';
    return await this.servicioWebPms.postAsync(url, email);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async createUser(model: UsuarioModel): Promise<number> {
    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/Guardar';
    return await this.servicioWebPms.postAsync(url, model);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async createUserTicket(model: UsuarioRegistroModel): Promise<any> {
    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/GuardarTicketUsuario';
    return await this.servicioWebPms.postAsync(url, model);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async editUser(model: UsuarioModel): Promise<number> {
    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/Modificar';
    return await this.servicioWebPms.postAsync(url, model);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getUserByEmail(email: string) {
    let url = this.servicioWebPms.pathUsuarios + '/Usuarios/Consultar?Email=' + email;
    return await this.servicioWebPms.getAsync(url);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ConsultarTipoUsuarios() {
    let url = this.servicioWebPms.pathCatalogos + '/TipoUsuario/Consultar';
    return await this.servicioWebPms.getAsync(url);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public logout(usuario: UsuarioModel) {
    this.authenticationState.next(false);
    localStorage.setItem('user', null);

    // Cada que se cierre sesión el usuario no debería de recibir ninguna notificación.
    usuario.recibe_notificacion = false;
    this.editUser(usuario)
    // src\services\inactividad.service.ts
    this.events.publish("detenerDetectorInactividad");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public isAuthenticated() {
    return this.authenticationState.value;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public setAutenticated() {
    this.authenticationState.next(true);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async setUserData(usuario: UsuarioModel) {
    localStorage.setItem('user', JSON.stringify(usuario));
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getUserLocalStorage(): UsuarioModel {
    return JSON.parse(localStorage.getItem('user'));
  }
}
