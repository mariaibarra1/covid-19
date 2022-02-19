import { Filter } from './../../utilities/filter';
import { InstanciaService } from './../../services/instancia.service';
import { ServicioUtilidades } from './../../services/utilidades.service';
import { MediaService } from './../../services/media.service';
import { CatalogosService } from './../../services/catalogos.service';
import { UsuarioModel } from './../../models/usuario.model';
import { AuthenticationService } from './../../services/authentication.service';
import { modelDocumentos } from './../../models/modelDocumentos';
import { modelEvidencia } from './../../models/modelEvidencia';
import { modelSubServicio } from './../../models/modelSubServicio';
import { modelServicio } from './../../models/modelServicio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { modelDependencias } from './../../models/modeldependencias';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ModalController, Platform } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { TicketsService } from '../../services/tickets.service';
import { InstanciaModel } from '../../models/instancia.model';
import { modelTickets } from '../../models/modelTickets';
import * as Constants from '../../utilities/constants';
import { modelCasosTicket } from '../../models/modelCasosTicket';
import { PreguntasModel } from '../../models/preguntas.model';
import { RespuestaModel } from '../../models/respuesta.model';
import { PreguntasXRespuestas } from '../../models/preguntasYrespuestas.model';
import { EncuestaSubmit } from '../../models/encuestaSubmit.model';
import { ResultadoPage } from '../resultado/resultado';

@IonicPage()
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})

export class TicketsPage implements OnInit {

  @ViewChild('search')
  public searchElementRef: ElementRef;
  public LoggedUser = new UsuarioModel;
  public casos = new Constants.casosTicket;
  public ticketsForm: FormGroup;
  public dependencias: modelDependencias;
  public servicios: modelServicio;
  public subservicios: modelSubServicio;
  public dependenciaSelected: number;
  public servicioSelected: number;
  public subservicioSelected: number;
  public subServSelectName: string = "";
  public subServStatic: number;
  public idCategoria: number;
  public categoria: string;
  public ListEvidencias: modelEvidencia[] = [];
  public ListDocumentos: modelDocumentos[];
  public evidencia: modelEvidencia;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  public address: string;
  public entidad: string;
  public municipio: string;
  public colonia: string;
  public CasosTicket: modelCasosTicket[];
  public searchTerm: string = '';
  public itemsSubServicios: modelSubServicio[] = [];
  public autocompleteItems;
  public autocomplete;
  public serviceAutoComplete: any;

  public ListaPreguntas: PreguntasModel[] = [];
  public ListaRespuestas: RespuestaModel[] = [];
  public ListPreguntasYRespuestas: PreguntasXRespuestas[] = [];
  public idTicketNav: number = 0;
  public idEncuestaNav: number = 0;
  public ListSumbit: EncuestaSubmit[] = [];

  public contenidoCargado: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public catalogService: CatalogosService,
    public formBuilder: FormBuilder,
    private servicioUtilidades: ServicioUtilidades,
    public actionSheetCtrl: ActionSheetController,
    public storageService: StorageService,
    public tickectService: TicketsService,
    public authService: AuthenticationService,
    public mediaService: MediaService,
    public instService: InstanciaService,
    public loadingCtrl: LoadingController,
    public filter: Filter,
    public modalCtrl: ModalController,
    public platform: Platform) {

    this.idCategoria = navParams.get('idCategoria');
    this.categoria = navParams.get('categoria') == null ? 'TU PRUEBA DE SALUD' : navParams.get('categoria');
    this.subServStatic = navParams.get('idSubservicio') == null ? 0 : navParams.get('idSubservicio');
    this.subServSelectName = navParams.get('nombreSubServicio') == null ? "" : navParams.get('nombreSubServicio');

    // Cambiar para obtener el id de la encuesta
    //this.idEncuestaNav = navParams.get('idEncuesta') == null ? 5 : navParams.get('idEncuesta');
    this.idTicketNav = navParams.get('idTicket') == null ? 0 : navParams.get('idTicket');
    //this.idEncuestaNav = + localStorage.getItem("idEncuesta");

    console.log('id del ticket desde nav:::' + this.idTicketNav);
    console.log('id de encuesta desde nav::::' + this.idEncuestaNav);

    this.ticketsForm = formBuilder.group({
      dependencia: [''],
      servicio: [''],
      subservicio: [Validators.compose([Validators.required])],
      descripcion: ['', Validators.compose([Validators.required])],
      ubicacion: [],
      comentario: [],
      evidencia: ['']
    });

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit(): void {
    this.userData();
    if (this.subServStatic > 0) this.subservicioSelected = this.subServStatic;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewWillEnter() {
    await this.getTicketDatos();
    await this.getPreguntas();
    //await this.getTicketDatos();

    await this.llenarValoresDeInicioAEncuesta();

    this.contenidoCargado = true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async userData() {
    let user = this.authService.getUserLocalStorage();
    if (user) {
      this.LoggedUser = user;
    } else {
      this.LoggedUser.idUsuario = 0;
      let instancia: InstanciaModel;
      instancia = await this.instService.getInstanciaLocalStorage();
      this.LoggedUser.idInstancia = instancia.idInstancia;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getTicketDatos() {
    let ticket = new modelTickets;
    if (this.idTicketNav) {
      ticket.idTicket = this.idTicketNav;
    } else {
      let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
      console.log(ListTicket);
      if (ListTicket) {
        //console.log();
        if (ListTicket.length > 0) {
          ticket.idTicket = ListTicket[0].idTicket;
          this.idTicketNav = ticket.idTicket;
        } else {
          this.servicioUtilidades.alerta('Error', 'No cuentas con ningun ticket asociado');
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuentas con ningun ticket asociado');
      }
    }
    let dataT = await this.tickectService.getTicket(ticket);
    console.log(dataT);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getPreguntas() {
    let instancia: InstanciaModel = await this.instService.getInstanciaLocalStorage();
    this.idEncuestaNav = instancia.idEncuesta;
    console.log('idEncuesta desde local storage::' + this.idEncuestaNav);
    if (this.idEncuestaNav) {
      if (this.idEncuestaNav > 0) {
        let preguntas = await this.catalogService.getPreguntas(this.idEncuestaNav, this.idTicketNav, false);
        if (preguntas) {
          if (preguntas.length) {
            if (preguntas.length > 0) {
              this.ListaPreguntas = preguntas as PreguntasModel[];
              await this.getRespuestas(this.idEncuestaNav);
            } else {
              this.ListaPreguntas = [];
              this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las preguntas de la encuesta');
            }
          } else {
            this.ListaPreguntas = [];
            this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las preguntas de la encuesta');
          }
        } else {
          this.ListaPreguntas = [];
          this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las preguntas de la encuesta');
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los datos del ticket asociado');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los datos del ticket asociado');

    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getRespuestas(idEncuesta) {
    //let idEncuesta = 5;
    let respuestas = await this.catalogService.getRespuestas(idEncuesta);
    if (respuestas) {
      if (respuestas.length) {
        if (respuestas.length > 0) {
          this.ListaRespuestas = respuestas as RespuestaModel[];
          this.asociarPreguntasXRespuestas();
        } else {
          this.ListaRespuestas = [];
          this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las respuestas de la encuesta');
        }
      } else {
        this.ListaRespuestas = [];
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las respuestas de la encuesta');
      }
    } else {
      this.ListaRespuestas = [];
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las respuestas de la encuesta');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async asociarPreguntasXRespuestas() {
    this.ListPreguntasYRespuestas = [];
    if (this.ListaPreguntas.length > 0 && this.ListaRespuestas.length > 0) {
      for (let i = 0; i < this.ListaPreguntas.length; i++) {
        let filtrado = this.ListaRespuestas.filter(z => z.idPregunta == this.ListaPreguntas[i].idPregunta && z.activo == true);
        if (filtrado) {
          if (filtrado.length > 0) {
            let nueva: PreguntasXRespuestas = new PreguntasXRespuestas();
            nueva.pregunta = this.ListaPreguntas[i];
            nueva.opciones = filtrado;
            this.ListPreguntasYRespuestas.push(nueva);
          }
        }
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los datos de la encuesta');

    }
    //console.log('preguntas y respuestas');
    //console.log(this.ListPreguntasYRespuestas);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Agregamos los valores por default al abrir la encuesta para que aparezcan en la encuesta.
  public llenarValoresDeInicioAEncuesta() {
    console.log("this.ListPreguntasYRespuestas");
    console.log(this.ListPreguntasYRespuestas);
    for (let i = 0; i < this.ListPreguntasYRespuestas.length; i++) {
      if (this.ListPreguntasYRespuestas[i].opciones.length > 0) {
        this.ListPreguntasYRespuestas[i].nombreRespuesta = this.ListPreguntasYRespuestas[i].opciones[0].descripcionRespuesta;
        this.ListPreguntasYRespuestas[i].respuesta = this.ListPreguntasYRespuestas[i].opciones[0].idRespuesta;
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public agregaRespuesta(id, pregunta) {
    //console.log(id);
    //console.log('valor de la respuesta elegida en el slider:::' + id.value);
    let index;
    if (id.value != 0) {
      index = Math.trunc(id.value / id.step);
    } else {
      index = 0;
    }
    //console.log('index de la respuesta:::' + index);
    //console.log('id de la pregunta :::' + pregunta);
    for (let i = 0; i < this.ListPreguntasYRespuestas.length; i++) {
      if (this.ListPreguntasYRespuestas[i].pregunta.idPregunta == pregunta) {
        if (this.ListPreguntasYRespuestas[i].opciones[index]) {
          this.ListPreguntasYRespuestas[i].respuesta = this.ListPreguntasYRespuestas[i].opciones[index].idRespuesta;
          this.ListPreguntasYRespuestas[i].nombreRespuesta = this.ListPreguntasYRespuestas[i].opciones[index].descripcionRespuesta;
          this.ListPreguntasYRespuestas[i].valorRespuesta = this.ListPreguntasYRespuestas[i].opciones[index].ponderacion;
        } else if (this.ListPreguntasYRespuestas[i].opciones[index + 1]) {
          this.ListPreguntasYRespuestas[i].respuesta = this.ListPreguntasYRespuestas[i].opciones[index + 1].idRespuesta;
          this.ListPreguntasYRespuestas[i].nombreRespuesta = this.ListPreguntasYRespuestas[i].opciones[index + 1].descripcionRespuesta;
          this.ListPreguntasYRespuestas[i].valorRespuesta = this.ListPreguntasYRespuestas[i].opciones[index + 1].ponderacion;
        } else if (this.ListPreguntasYRespuestas[i].opciones[index - 1]) {
          this.ListPreguntasYRespuestas[i].respuesta = this.ListPreguntasYRespuestas[i].opciones[index - 1].idRespuesta;
          this.ListPreguntasYRespuestas[i].nombreRespuesta = this.ListPreguntasYRespuestas[i].opciones[index - 1].descripcionRespuesta;
          this.ListPreguntasYRespuestas[i].valorRespuesta = this.ListPreguntasYRespuestas[i].opciones[index - 1].ponderacion;

        }
        //this.ListPreguntasYRespuestas[i].respuesta = id;
        //console.log('respuesta asociada a la pregunta');
        //console.log(this.ListPreguntasYRespuestas[i]);
      }
    }
    //console.log('total de preguntas');
    //console.log(this.ListPreguntasYRespuestas);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public findMin(opciones: RespuestaModel[]) {
    let min = 0;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].ponderacion <= min) {
        min = opciones[i].ponderacion;
      }
    }
    //console.log('valor minimo ::'+min);
    return min;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public findMax(opciones: RespuestaModel[]) {
    let max = 0;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].ponderacion >= max) {
        max = opciones[i].ponderacion;
      }
    }
    //console.log('valor maximo ::'+max);
    return max;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getStep(opciones: RespuestaModel[]) {
    let max = this.findMax(opciones);
    let step = Math.trunc(max / (opciones.length - 1));
    //console.log('stept:::'+step);
    return step;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async submitEncuesta() {
    let suma = 0;
    this.ListSumbit = [];
    for (let i = 0; i < this.ListPreguntasYRespuestas.length; i++) {
      suma += this.ListPreguntasYRespuestas[i].valorRespuesta;
    }
    for (let i = 0; i < this.ListPreguntasYRespuestas.length; i++) {
      let q = new EncuestaSubmit({});
      q.idPregunta = +this.ListPreguntasYRespuestas[i].pregunta.idPregunta;
      q.idRespuesta = +this.ListPreguntasYRespuestas[i].respuesta;
      q.idTicket = +this.idTicketNav;
      q.idEncuesta = +this.idEncuestaNav;
      q.IdUsuario = this.LoggedUser.idUsuario;
      q.ponderacion = + this.ListPreguntasYRespuestas[i].opciones.find(x => x.idRespuesta == q.idRespuesta).ponderacion;
      q.Resultado = suma;
      q.IdResultEncuesta = null;
      this.ListSumbit.push(q);
    }
    console.log('array para mandar a guardar');
    console.log(this.ListSumbit);
    let resp = await this.catalogService.postEncuesta(this.ListSumbit);
    console.log(resp);
    if (resp == 0) {
      this.navCtrl.setRoot(ResultadoPage, { sumaEncuesta: suma });
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar las respuestas de la encuesta');
    }
  }

}
