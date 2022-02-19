import { ServicioUtilidades } from './../../services/utilidades.service';
import { AuthenticationService } from './../../services/authentication.service';
import { TicketsPage } from './../tickets/tickets';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { UsuarioModel } from '../../models/usuario.model';
import * as Constants from '../../utilities/constants';
import { CatalogosService } from './../../services/catalogos.service';
import { modelCasosTicket } from '../../models/modelCasosTicket';
import { InstanciaModel } from './../../models/instancia.model';
import { InstanciaService } from './../../services/instancia.service';
import { modelBanners } from './../../models/modelBanners';
import { BannerService } from './../../services/banner.service';
import { TicketsService } from '../../services/tickets.service';
import { EncuestaActualizarPage } from '../encuesta-actualizar/encuesta-actualizar';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {
  @ViewChild(Slides) slides: Slides;
  public currentInstance: InstanciaModel;
  public LoggedUser: UsuarioModel;
  public casos = new Constants.casosTicket;
  public CasosTicket: modelCasosTicket[];
  public sliderLoaded: boolean = false;
  public folioTicket: string = '';
  public sumaEncuesta = 0;
  public avisos = [];
  public nombreCaso: string = '';
  public icon: string;
  public fechaActualizacion: string;
  public contenidoCargado: boolean = false;
  public ActualizaEncuesta: boolean = false;
  public ComplementaEncuesta: boolean = false;
  public IdTicket: number = 0;
  public Encuestas = [];
  public idEncuestaNav: number = 0;
  public tieneEncuestasRegistradas: boolean = false;
  public BannerRowValues: modelBanners[];

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    private authService: AuthenticationService,
    private catalogosService: CatalogosService,
    private instService: InstanciaService,
    private bannerService: BannerService,
    private CatalogosService: CatalogosService,
    private servicioUtilidades: ServicioUtilidades,
    private tickectService: TicketsService
  ) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public goToSlide() {
    this.slides.slideTo(0, 500);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public slideChanged() {
    this.slides.getActiveIndex();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {
    this.tieneEncuestasRegistradas = false;
    this.userData();
    this.loadBanners();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewWillEnter() {
    this.GetInstancia();
    this.getFirstTicketUsr();

    if (this.sliderLoaded) {
      this.slides.startAutoplay();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewWillLeave() {
    if (this.sliderLoaded) {
      this.slides.stopAutoplay();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async loadBanners() {
    let instancia = await this.instService.getInstanciaLocalStorage()
    this.BannerRowValues = await this.bannerService.ProcesosBanner(instancia.idInstancia);
    this.sliderLoaded = true;

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async userData() {
    this.LoggedUser = this.authService.getUserLocalStorage();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async GetInstancia() {
    let instancia: InstanciaModel = await this.instService.getInstanciaLocalStorage();
    //let instancia: InstanciaModel = await this.instService.getInstanciaLocalStorage();
    this.idEncuestaNav = instancia.idEncuesta;
    console.log('idEncuesta desde local storage::' + this.idEncuestaNav);

    this.CasosTicket = await this.catalogosService.ConsultaTiposAtencion(instancia.idInstancia);
    // this.FillTAtencion();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async FillTAtencion() {
    this.CasosTicket;
    console.log(this.CasosTicket);
    if (this.CasosTicket.find(m => m.nombre.toUpperCase().includes("SALUD")) != null) {
      this.casos.idQueja = this.CasosTicket.find(m => m.nombre.toUpperCase().includes("SALUD")).idCaso;
      console.log(this.casos.idQueja);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public formularioTickets(idCategoria, categoria) {
    this.navCtrl.push(TicketsPage, {
      idCategoria: idCategoria,
      categoria: categoria
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getFirstTicketUsr() {
    this.ActualizaEncuesta = false;
    this.ComplementaEncuesta = false;
    this.IdTicket = 0;
    //let user = await this.authService.getUserData();
    //getUserLocalStorage
    let user = this.authService.getUserLocalStorage();

    if (user) {
      this.LoggedUser = user;
    } else {
      this.LoggedUser.idUsuario = 0;
      this.LoggedUser.nombre = '';
    }
    console.log('el id del usuario es:::' + this.LoggedUser.idUsuario);
    let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
    console.log('tickets del usuario');
    console.log(ListTicket);
    if (ListTicket) {
      if (ListTicket.length > 0) {
        if (ListTicket[0].idTicket) {
          console.log(ListTicket[0].idTicket);
          if (this.folioTicket == '') {
            this.folioTicket = ListTicket[0].folio;
            console.log('folio:::::' + this.folioTicket);
          }
          this.IdTicket = ListTicket[0].idTicket;
          this.Encuestas = await this.CatalogosService.getEncuestaXTicket(ListTicket[0].idTicket);
          console.log('encuestas');
          console.log(this.Encuestas);
          if (this.Encuestas) {
            if (this.Encuestas.length > 0) {
              await this.verificarEncuesta(this.Encuestas);
            } else {
              //this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
              this.tieneEncuestasRegistradas = false;
              this.contenidoCargado = true;
            }
          } else {
            //this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
            this.tieneEncuestasRegistradas = false;
            this.contenidoCargado = true;
          }
          this.fechaActualizacion = ListTicket[0].fechaActualizacion;
          this.ActualizaEncuesta = ListTicket[0].actualizacion_encuesta;
          this.ComplementaEncuesta = ListTicket[0].complementar_encuesta;
          //await this.obtenerResultado(this.sumaEncuesta);
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async verificarEncuesta(encuesta) {
    let suma = 0;
    for (let i = 0; i < encuesta.length; i++) {
      suma += + encuesta[i].ponderacion;
    }
    console.log('suma de la encuesta:::::' + suma);
    await this.obtenerResultado(suma);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerResultado(suma) {
    this.avisos = await this.CatalogosService.getResultadoPorSuma(suma);
    console.log(this.avisos);
    console.log(this.avisos[0]);
    if (this.avisos[0]) {
      if (this.avisos[0][0]) {
        if (this.avisos[0][0].idCaso) {
          await this.getCasos(this.avisos[0][0].idCaso);
        } else {
          this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getCasos(idCaso) {
    console.log('id del caso:::' + idCaso);
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    this.CasosTicket = await this.CatalogosService.ConsultaTiposAtencion(instancia.idInstancia);
    //this.CasosTicket.find(x=>x.idCaso==idCaso);
    if (this.CasosTicket.find(x => x.idCaso == idCaso)) {
      console.log('encontrado el caso');
      if (this.CasosTicket.find(x => x.idCaso == idCaso).nombre) {
        //console.log('no trae nombre');
        this.nombreCaso = this.CasosTicket.find(x => x.idCaso == idCaso).nombre;
        this.getIcon(this.CasosTicket.find(x => x.idCaso == idCaso).nombre)
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getIcon(nombre: string) {
    console.log('nombre del caso::' + nombre);
    switch (nombre.toUpperCase()) {
      case 'BAJO':
        this.icon = 'assets/icon/r_bajo.svg';
        break;
      case 'MODERADO':
        this.icon = 'assets/icon/r_moderado.svg';
        break;
      case 'ALTO':
        this.icon = 'assets/icon/r_alto.svg';
        break;
      case 'MUY ALTO':
        this.icon = 'assets/icon/r_muy_alto.svg';
        break;
    }
    console.log('icono::::' + this.icon);
    this.contenidoCargado = true;
    this.tieneEncuestasRegistradas = true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public sendEncuesta() {
    this.navCtrl.push(EncuestaActualizarPage);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public iniciaEncuesta() {
    this.navCtrl.setRoot(TicketsPage, { autenticado: true, firstTicket: true, idEncuesta: this.idEncuestaNav, idTicket: this.IdTicket });
  }

}
