import { Injectable } from "@angular/core";
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CoordenadaModel } from "../models/coordenada.model";

@Injectable()
//=====================================================================================================================
// Este servicio es exclusivo de código GENERICO que se pueda usar en cualquier otra clase. NO utilziar esta clase 
// como extensión a métodos específicos.
export class ServicioUtilidades {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(private loadingController: LoadingController,
        public alertController: AlertController,
        private geolocation: Geolocation,
        private toastController: ToastController) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Cambia todo a minúscula y quita todos los caracteres raros con(acentuación rara), los acentos comunes y silvestres
    // quedan normal.
    public limpiarTexto(texto: string) {
        if (texto == null || texto == "")
            return texto;

        texto = texto.trim();
        texto = texto.toLowerCase();
        texto = texto.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        texto = texto.replace(new RegExp(/[àâãäå]/g), "a");
        texto = texto.replace(new RegExp(/[èêë]/g), "e");
        texto = texto.replace(new RegExp(/[ìîï]/g), "i");
        // texto = texto.replace(new RegExp(/ñ/g),"n");    
        texto = texto.replace(new RegExp(/[òôõö]/g), "o");
        texto = texto.replace(new RegExp(/[ùûü]/g), "u");

        return texto;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // validación para el correo electrónico
    // quedan normal.
    public limpiarCorreoElectronico(texto: string) {
        if (texto == null || texto == "")
            return texto;

        texto = texto.trim();
        texto = texto.toLowerCase();
        texto = texto.replace(new RegExp(/[àâãäå]/g), "a");
        texto = texto.replace(new RegExp(/[èêë]/g), "e");
        texto = texto.replace(new RegExp(/[ìîï]/g), "i");
        texto = texto.replace(new RegExp(/[òôõö]/g), "o");
        texto = texto.replace(new RegExp(/[ùûü]/g), "u");

        return texto;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Obtiene la alerta (no se muestra hasta que se necesite) por si la necesitamos usar en cierto punto en específico 
    // (después de alguna acción);
    public obtenerAlerta(titulo: string, mensaje: string) {
        let alert = this.alertController.create({
            title: titulo,
            message: mensaje,
            buttons: [{
                text: 'Cerrar',
                handler: () => {
                    return true;
                }
            }],
        });
        return alert;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public alerta(titulo: string, mensaje: string) {
        this.alertController.create({
            title: titulo,
            message: mensaje,
            buttons: [{
                text: 'Cerrar',
                handler: () => {
                    return true;
                }
            }],
        }).present();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public alertaPrompt(titulo: string, mensaje: string, placeholder?: string) {
        let alerta = this.alertController.create({
            title: titulo,
            inputs: [
                {
                    name: 'input',
                    placeholder: placeholder
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: data => {

                    }
                },
                {
                    text: 'Aceptar',
                    handler: data => {
                        if (data.input != "") {
                            alerta.dismiss(true);
                            return false;
                        } else {
                            alerta.setMessage("Este campo es obligatorio");
                            return false;
                        }
                    }
                }
            ]
        });
        return alerta;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public capitalizar(texto: string = "") {
        if (texto == "")
            return texto;
        texto = texto.toLocaleLowerCase();
        let arrText = texto.split(" ");

        texto = "";
        for (let i = 0; i < arrText.length; i++) {
            if (arrText[i] == " " || arrText[i] == "")
                continue;
            if (i != 0)
                texto += " ";
            texto += arrText[i][0].toUpperCase() + arrText[i].slice(1);
        }

        return texto;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public dropdownDiasSemana = [
        { nombre: "lunes", numero: 1 },
        { nombre: "martes", numero: 2 },
        { nombre: "miércoles", numero: 3 },
        { nombre: "jueves", numero: 4 },
        { nombre: "viernes", numero: 5 },
        { nombre: "sábado", numero: 6 },
        { nombre: "domingo", numero: 7 },
    ];

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public loading(mensaje?: string) {
        let loading = this.loadingController.create({
            content: (mensaje != null ? mensaje : 'Cargando...')
        });
        return loading;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Ejemplo: 
    /*
     let confirmacion = this.servicioUtilidades.mensajeDeConfirmacion("¿Desea desasignar esta arma?", "Guarde los cambios para guardar esta acción");
      confirmacion.onDidDismiss((resp) => {
        if(resp == true){
          this.policia.arma = null;
        }
      });
      confirmacion;
    */
    public mensajeDeConfirmacion(titulo: string, mensaje: string) {
        let alert = this.alertController.create({
            title: titulo,
            message: mensaje,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        alert.dismiss(false);
                        return false;
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        return alert;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Pasa el texto a minúsculas y le quita los acentos.
    public quitarAcentos(texto: string = "") {
        if (texto == null || texto == "")
            return texto;

        var textoLimpio = texto.toLowerCase();
        textoLimpio = textoLimpio.replace(new RegExp(/[àáâãäå]/g), "a");
        textoLimpio = textoLimpio.replace(new RegExp(/[èéêë]/g), "e");
        textoLimpio = textoLimpio.replace(new RegExp(/[ìíîï]/g), "i");
        // textoLimpio = textoLimpio.replace(new RegExp(/ñ/g),"n");    
        textoLimpio = textoLimpio.replace(new RegExp(/[òóôõö]/g), "o");
        textoLimpio = textoLimpio.replace(new RegExp(/[ùúûü]/g), "u");

        return textoLimpio;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public toast(mensaje: string, posicion: string = "bottom") {
        let toast = this.toastController.create({
            message: mensaje,
            duration: 3000,
            position: posicion
        });
        toast.present();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // True: el archivo tiene un tamaño adecuado (menos de 5MB)
    // False: Excede el tamaño del archivo, se mamó
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public validarTamanoArchivo(archivo: any) {
        if (archivo == null)
            return true;

        let maxTam = Number(5000000); //5MB
        if (archivo.size < maxTam)
            return true;

        this.alerta("Archivo demasiado grande.", "El tamaño del archivo no debe exceder los " + maxTam / 1000000 + "MB");
        return false;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // True: valida.
    // false: inválida.
    public validarCoordenada(coordenada: number) {
        if (coordenada.toString().length > 7 && coordenada.toString().length < 12 && (coordenada % 1 != 0))
            return true;

        return false;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public coordenadaDentroPoligono(coordenada: CoordenadaModel, poligono: Array<CoordenadaModel>) {

        var x = coordenada.lat, y = coordenada.lng;
        var dentro = false;
        for (var i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
            var xi = poligono[i].lat, yi = poligono[i].lng;
            var xj = poligono[j].lat, yj = poligono[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) dentro = !dentro;
        }

        return dentro;
    };

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public esJson(str): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    //===SOLO MÓVIL=============================================================================================
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // regresa: coords: {
    // longitude: 0,
    // latitude: 0 }
    // ejemplo de uso: promGeo.coords.latitude
    public obtenerPromesaGeolocalizacion(): Promise<CoordenadaModel> {
        return new Promise<any>((resolve, reject) => {
            this.geolocation.getCurrentPosition().then(resp => {
                let ubicacion: CoordenadaModel = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                }
                return resolve(ubicacion);
            }).catch(err => {
                return resolve(null);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Regresa un codigo aleatorio (sin parámetros de 6 dígitos) con proposito de autenticación de correo, etc.
    public generarCodigoVerificacionAleatorio(min?: number, max?: number) {
        return (Math.round(Math.random() * ((max == null ? 1000000 : max) - (min == null ? 99999 : min) + (min == null ? 99999 : min))).toString());
    }

    //===SOLO MÓVIL=============================================================================================
}