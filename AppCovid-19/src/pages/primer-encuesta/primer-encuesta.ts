import { InstanciaService } from './../../services/instancia.service';
import { ServicioUtilidades } from './../../services/utilidades.service';
import { CatalogosService } from './../../services/catalogos.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { InstanciaModel } from '../../models/instancia.model';
import { PreguntasModel } from '../../models/preguntas.model';
import { RespuestaModel } from '../../models/respuesta.model';
import { PreguntasXRespuestas } from '../../models/preguntasYrespuestas.model';
import { EncuestaSubmit } from '../../models/encuestaSubmit.model';
import { PrimerResultadoPage } from '../primer-resultado/primer-resultado';

@IonicPage()
@Component({
  selector: 'page-primer-encuesta',
  templateUrl: 'primer-encuesta.html',
})
export class PrimerEncuestaPage {

  @ViewChild('search')
  public categoria: string;
  public ListaPreguntas: PreguntasModel[] = [];
  public ListaRespuestas: RespuestaModel[] = [];
  public ListPreguntasYRespuestas: PreguntasXRespuestas[] = [];
  public idTicketNav: number = 0;
  public idEncuestaNav: number = 0;
  public ListSumbit: EncuestaSubmit[] = [];
  public contenidoCargado: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    private catalogService: CatalogosService,
    private servicioUtilidades: ServicioUtilidades,
    private instService: InstanciaService,
  ) {
    this.idTicketNav = 0;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit(): void {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewWillEnter() {
    this.categoria = 'TU PRUEBA DE SALUD';
    await this.getPreguntas();
    await this.llenarValoresDeInicioAEncuesta();
    this.contenidoCargado = true;
  }

  validaEncuesta(idEncuesta): boolean {
    if (idEncuesta > 0) {
      return true;
    } else {
      return false;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  validaArrayPreguntas(preguntas): boolean {
    if (preguntas) {
      if (preguntas.length) {
        if (preguntas.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  validaArrayRespuestas(respuestas): boolean {
    if (respuestas) {
      if (respuestas.length) {
        if (respuestas.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getPreguntas() {
    this.ListaPreguntas = [];
    let instancia: InstanciaModel = await this.instService.getInstanciaLocalStorage();
    this.idEncuestaNav = instancia.idEncuesta;
    console.log('idEncuesta desde local storage::' + this.idEncuestaNav);
    if (this.validaEncuesta(this.idEncuestaNav)) {
      let preguntas = await this.catalogService.getPreguntasNoTicket(this.idEncuestaNav, false);
      if (this.validaArrayPreguntas(preguntas)) {
        this.ListaPreguntas = preguntas as PreguntasModel[];
        await this.getRespuestas(this.idEncuestaNav);
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las preguntas de la encuesta');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'La instancia no tiene una encuesta asignada');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getRespuestas(idEncuesta) {
    this.ListaRespuestas = [];
    let respuestas = await this.catalogService.getRespuestas(idEncuesta);
    if (this.validaArrayRespuestas(respuestas)) {
      this.ListaRespuestas = respuestas as RespuestaModel[];
      this.asociarPreguntasXRespuestas();
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener las respuestas de la encuesta');
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async asociarPreguntasXRespuestas() {
    this.ListPreguntasYRespuestas = [];
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
  public findMax(opciones: RespuestaModel[]) {
    let max = 0;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].ponderacion >= max) {
        max = opciones[i].ponderacion;
      }
    }
    return max;
  }
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
      q.IdUsuario = 0;
      q.ponderacion = + this.ListPreguntasYRespuestas[i].opciones.find(x => x.idRespuesta == q.idRespuesta).ponderacion;
      q.Resultado = suma;
      q.IdResultEncuesta = null;
      this.ListSumbit.push(q);
    }
    console.log('array para guardar en local storage');
    console.log(this.ListSumbit);
    localStorage.setItem('encuesta_respondida', JSON.stringify(this.ListSumbit));
    //let resp = await this.catalogService.postEncuesta(this.ListSumbit);
    console.log(suma);
    //this.navCtrl.setRoot(ResultadoPage, { sumaEncuesta: suma });
    this.navCtrl.setRoot(PrimerResultadoPage, { sumaEncuesta: suma });
  }

}
