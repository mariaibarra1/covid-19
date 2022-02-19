import { InstanciaService } from './../../services/instancia.service';
import { ServicioUtilidades } from './../../services/utilidades.service';
import { MediaService } from './../../services/media.service';
import { CatalogosService } from './../../services/catalogos.service';
import { UsuarioModel } from './../../models/usuario.model';
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ModalController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { TicketsService } from '../../services/tickets.service';
import { InstanciaModel } from '../../models/instancia.model';
import { modelTickets } from '../../models/modelTickets';
import { PreguntasModel } from '../../models/preguntas.model';
import { RespuestaModel } from '../../models/respuesta.model';
import { PreguntasXRespuestas } from '../../models/preguntasYrespuestas.model';
import { EncuestaSubmit } from '../../models/encuestaSubmit.model';
import { ResultadoPage } from '../resultado/resultado';

@IonicPage()
@Component({
  selector: 'page-encuesta-actualizar',
  templateUrl: 'encuesta-actualizar.html',
})
export class EncuestaActualizarPage {
  //#region variables
  public ListaPreguntas: PreguntasModel[] = [];
  public ListaRespuestas: RespuestaModel[] = [];
  public ListPreguntasYRespuestas: PreguntasXRespuestas[] = [];
  public idTicketNav: number = 0;
  public idEncuestaNav: number = 0;
  public LoggedUser = new UsuarioModel;
  public ListSumbit: EncuestaSubmit[] = [];
  public contenidoCargado: boolean = false;
  Encuestas = [];
  folioTicket: string = '';
  banderaActualizacion = false;
  //#endregion
  constructor(
    public navCtrl: NavController,
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
    public modalCtrl: ModalController,
  ) {

    this.idTicketNav = navParams.get('idTicket') == null ? 0 : navParams.get('idTicket');
    console.log('id del ticket desde nav:::' + this.idTicketNav);
    console.log('id de encuesta desde nav::::' + this.idEncuestaNav);
  }

  ionViewDidLoad() {
  }

  public async ionViewWillEnter() {
    //await this.getPreguntas();
    await this.getAllTicketsUsr();
    //await this.llenarValoresDeInicioAEncuesta();
    this.contenidoCargado = true;
  }
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

  public async getPreguntas(anteriores: boolean) {
    let instancia: InstanciaModel = await this.instService.getInstanciaLocalStorage();
    this.idEncuestaNav = instancia.idEncuesta;
    console.log('idEncuesta desde local storage::' + this.idEncuestaNav);
    if (this.idEncuestaNav) {
      if (this.idEncuestaNav > 0) {
        //con true al final obtiene las preguntas que ya contesto, con false obtiene las complementarias
        //let preguntas = await this.catalogService.getPreguntas(this.idEncuestaNav, this.idTicketNav, true);
        let preguntas = await this.catalogService.getPreguntas(this.idEncuestaNav, this.idTicketNav, anteriores);
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

  public async getRespuestas(idEncuesta) {
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
  }
  public async getTicketDatos() {
    let ticket = new modelTickets;
    if (this.idTicketNav) {
      ticket.idTicket = this.idTicketNav;
    } else {
      let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
      console.log(ListTicket);
      if (ListTicket) {
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
  public async getAllTicketsUsr() {
    await this.userData();
    let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
    console.log('tickets del usuario');
    console.log(ListTicket);
    if (ListTicket) {
      if (ListTicket.length > 0) {
        if (ListTicket[0].idTicket) {
          console.log(ListTicket[0].idTicket);
          this.idTicketNav = ListTicket[0].idTicket;
          //await this.getPreguntas();
          if (this.folioTicket == '') {
            this.folioTicket = ListTicket[0].folio;
            console.log('folio:::::' + this.folioTicket);
          }
          //separar actualizar encuesta / encuesta compementaria
          if (ListTicket[0].complementar_encuesta) {
            await this.ProcesoComplementaEncuesta(ListTicket[0].idTicket);
          } else {
            await this.ProcesoActualizaEncuesta(ListTicket[0].idTicket);
          }
          ///////this.Encuestas = await this.catalogService.getPreguntas(5,ListTicket[0].idTicket,true);
          // this.Encuestas = await this.catalogService.getEncuestaXTicket(ListTicket[0].idTicket);
          // console.log('encuestas');
          // console.log(this.Encuestas);
          // if (this.Encuestas) {
          //   if (this.Encuestas.length > 0) {
          //     await this.llenarValoresDeInicioAEncuesta();
          //     this.getValoresEncuestaAnterior(this.Encuestas);
          //   } else {
          //     this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
          //   }
          // } else {
          //   this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
          // }
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
    }

  }
  public async ProcesoComplementaEncuesta(idTicket) {
    this.banderaActualizacion = false;
    await this.getPreguntas(false);
    this.Encuestas = await this.catalogService.getEncuestaXTicket(idTicket);
    console.log('encuestas');
    console.log(this.Encuestas);
    if (this.Encuestas) {
      if (this.Encuestas.length > 0) {
        await this.llenarValoresDeInicioAEncuesta();
        //no se deben obtener los valores anteriores, son respuestas de siguiente nivel
        //this.getValoresEncuestaAnterior(this.Encuestas);
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
    }
  }

  public async ProcesoActualizaEncuesta(idTicket) {
    this.banderaActualizacion = true;
    await this.getPreguntas(true);
    this.Encuestas = await this.catalogService.getEncuestaXTicket(idTicket);
    console.log('encuestas');
    console.log(this.Encuestas);
    if (this.Encuestas) {
      if (this.Encuestas.length > 0) {
        await this.llenarValoresDeInicioAEncuesta();
        this.getValoresEncuestaAnterior(this.Encuestas);
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
    }
  }

  // Agregamos los valores por default al abrir la encuesta para que aparezcan en la encuesta.
  public async getValoresEncuestaAnterior(modelo) {
    console.log(modelo);
    console.log("Prellenado con las respuestas anteriores");
    console.log(this.ListPreguntasYRespuestas);
    for (let i = 0; i < this.ListPreguntasYRespuestas.length; i++) {
      if (this.ListPreguntasYRespuestas[i].opciones.length > 0) {
        let nombreRes = modelo.find(x => x.idPregunta == this.ListPreguntasYRespuestas[i].pregunta.idPregunta);
        console.log('respuesta precargada:::');
        console.log(nombreRes);
        if (nombreRes) {
          this.ListPreguntasYRespuestas[i].nombreRespuesta = nombreRes.descripcionRespuesta;
          this.ListPreguntasYRespuestas[i].respuesta = nombreRes.idRespuesta;
          this.ListPreguntasYRespuestas[i].idPr = nombreRes.idPr;
          this.ListPreguntasYRespuestas[i].valorRespuesta = nombreRes.ponderacion;
        }
      }
    }
  }



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


  public agregaRespuesta(id, pregunta) {
    let index;
    if (id.value != 0) {
      index = Math.trunc(id.value / id.step);
    } else {
      index = 0;
    }
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

      }
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public findMin(opciones: RespuestaModel[]) {
    let min = 0;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].ponderacion <= min) {
        min = opciones[i].ponderacion;
      }
    }
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
    return max;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getStep(opciones: RespuestaModel[]) {
    let max = this.findMax(opciones);
    let step = Math.trunc(max / (opciones.length - 1));
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
      q.idPr = +this.ListPreguntasYRespuestas[i].idPr;
      this.ListSumbit.push(q);
    }
    console.log('array para mandar a guardar');
    console.log(this.ListSumbit);
    //debugger;
    if (this.banderaActualizacion) {
      let resp = await this.catalogService.modificarEncuesta(this.ListSumbit);
      console.log(resp);
      if (resp == 0) {
        this.navCtrl.setRoot(ResultadoPage, { sumaEncuesta: suma });
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar las respuestas de la encuesta');
      }
    } else {
      let resp = await this.catalogService.postEncuesta(this.ListSumbit);
      console.log(resp);
      if (resp == 0) {
        this.navCtrl.setRoot(ResultadoPage, { sumaEncuesta: suma });
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar las respuestas de la encuesta');
      }
    }
  }


}
