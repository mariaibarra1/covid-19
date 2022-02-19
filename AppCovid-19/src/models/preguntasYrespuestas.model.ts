import { PreguntasModel } from "./preguntas.model";
import { RespuestaModel } from "./respuesta.model";

export class PreguntasXRespuestas{
    pregunta:PreguntasModel;
    opciones:RespuestaModel[]=[];
    respuesta:number=0;
    nombreRespuesta:string='';
    valorRespuesta:number=0;
    idPr:number=0;
    constructor(){
      this.pregunta= new PreguntasModel({});
    }
  }