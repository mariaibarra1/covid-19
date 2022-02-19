import { Injectable } from '@angular/core';
import { Idle } from 'idlejs/dist';
import { AuthenticationService } from './authentication.service';
import { App, Events } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { UsuarioModel } from '../models/usuario.model';

@Injectable()
export class ServicioInactividad {

  public procesoActivo = false;
  public segundosTolerancia: number = 60 * 120;
  public segundosAvisoCierreSesion: number = 20;
  public segundosRestantes: number;
  public idle: Idle;
  public subsInterval: any;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private authenticationService: AuthenticationService,
    private app: App,
    private events: Events) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public inicializarListeners() {
    // Iniciamos los eventos para que puedan ser llamados cuando se cierre sesión.
    this.events.subscribe('iniciarDetectorInactividad', () => {
      this.iniciarDetectorInactividad();
    });

    this.events.subscribe('detenerDetectorInactividad', () => {
      this.detenerDetectorInactividad();
    });

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Detecta si hay actividad por parte del usuario, si no... se le cierra sesión dependiendo el tiempo de tolerancia
  public iniciarDetectorInactividad() {
    if (this.procesoActivo)
      return;

    this.segundosRestantes = this.segundosTolerancia;
    this.idle = new Idle().whenNotInteractive().start().do(() => {
      if (this.segundosRestantes < this.segundosAvisoCierreSesion)
        console.log(`        ┌─╨─┐♫♪♫
        ╡-_-╞  Más te vale...
        └╥─╥┘
        `);

      this.segundosRestantes = this.segundosTolerancia;
    })

    this.subsInterval = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes == 20)
        console.log(`        ┌─╨─┐♫♪♫
        ╡Ò_ó╞ Te estás quedando dormido?? en ${this.segundosAvisoCierreSesion} segundos cerraremos tu sesión compa...
        └╥─╥┘
        `);

      if (this.segundosRestantes <= 0) {
        let usuario: UsuarioModel = this.authenticationService.getUserLocalStorage();
        if (usuario != null)
          this.authenticationService.logout(usuario);
        this.app.getRootNav().setRoot(LoginPage);
        this.detenerDetectorInactividad()
        console.log(`           z‧‧z
        ‧ „◞„_ Z
        { (-. - ) }
        ░░░░░
        ░░░░░ Quien se fue a la villa se le cerró la sesión de su app.`);
      }
    }, 1000)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public detenerDetectorInactividad() {
    this.procesoActivo = false;
    if (this.subsInterval)
      clearInterval(this.subsInterval);

    if (this.idle)
      this.idle.stop();
  }

}
