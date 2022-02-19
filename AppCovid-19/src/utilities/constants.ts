export const enum_tabs = {
  inicio: 0,
  mi_estado: 1,
  noticias: 2,
  avisos: 2,
  mapa_hospitales: 3,
  ajustes: 4
}

export const enum_ca_notificaciones = {
  aviso: 1,
  seguimieto: 2,
  revision: 3
}

export class casosTicket {
  idQueja: number;
  idDenuncia: number;
  idAsesoria: number;
  idPeticion: number;
}

export const canalMovil = 3;
export const errorConexion = -1;
export const mensajeErrorConexion = 'Revise su conexión a Internet';
export const mensajeEspera = 'Por favor, espere..'
export const relEstadoInstancia = 4;
export const relMunicipioInstancia = 5;
//export const relMunicipioInstancia = 2;
export const documentoActivo = 1;
export const maxSizeVideo = 52428800;//50 mb; //41943040;//40 mb 
export const mensajeMaxVideo = "El video no debe ser superior a 50 mb"
export const zoomMap = 15;
