import { Injectable } from "@angular/core";
import 'firebase/storage';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ServicioWebPms } from "./web-pms.servicio";
import { UsuarioModel } from "../models/usuario.model";
import { AuthenticationService } from "./authentication.service";
import { Badge } from '@ionic-native/badge/ngx';
import { ServicioUtilidades } from "./utilidades.service";
import { Platform, Events } from "ionic-angular";
import { PRODUCCION } from "../app/ambiente";

@Injectable()
export class ServicioNotificaciones {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private push: Push,
        private http: HttpClient,
        private servicioWebPms: ServicioWebPms,
        private authenticationService: AuthenticationService,
        private badge: Badge,
        private platform: Platform,
        private servicioUtilidades: ServicioUtilidades,
        private events: Events) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async obtenerNotificacionesPorIdUsuario(idUsuario: number) {
        let url = this.servicioWebPms.pathCatalogos + '/Notificacion/Consultar?idUsuario=' + idUsuario;
        return await this.servicioWebPms.getAsync(url);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async editarNotificacion(notificacion: any) {
        let url = this.servicioWebPms.pathCatalogos + '/Notificacion/Modificar';
        return await this.servicioWebPms.postAsync(url, notificacion);
    }

    // Cada que iniciamos sesión guardamos el token de autenticacion para recibir notificaciones.
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async guardarTokenNotificacionEnUsuario(usuario: UsuarioModel): Promise<UsuarioModel> {
        let tokenNotificaciones = await this.obtenerTokenAppNotificaciones();
        if (tokenNotificaciones == null)
            return usuario;

        usuario.token = tokenNotificaciones;
        usuario.recibe_notificacion = true;
        await this.authenticationService.editUser(usuario);
        return usuario;
    }


    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Instalar desde la consola:
    // ionic cordova plugin add phonegap-plugin-push --variable SENDER_ID="780868051547"
    // npm install --save @ionic-native/push@4
    public async obtenerTokenAppNotificaciones(): Promise<string> {
        await this.platform.ready();
        const options: PushOptions = {
            android: {
                // Id de la aplicación registrada en firebase.
                senderID: "780868051547"
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            }
        };

        const pushObject: PushObject = this.push.init(options);

        // Se activa cuando se obtiene el token de la aplicación.
        let token = await new Promise<any>((resolve, reject) => {
            let subs = pushObject.on('registration').subscribe((registration: any) => {
                subs.unsubscribe();
                if (PRODUCCION == false)
                    this.servicioUtilidades.toast("Token notificaciones generado: " + JSON.stringify(registration.registrationId), "top");
                return resolve(registration.registrationId);
            }, error => {
                if (PRODUCCION == false)
                    this.servicioUtilidades.alerta("Hubo un error al obtener el token notificaciones: ", JSON.stringify(error));
                subs.unsubscribe();
                return resolve(null);
            });
            setTimeout(() => {
                subs.unsubscribe()
                if (PRODUCCION == false && this.platform.is("android") == false && this.platform.is("ios") == false)
                    this.servicioUtilidades.toast("Token notificaciones NO generado, ¿estás en la web?", "top");
                return resolve(null);
            }, 5000);
        });

        pushObject.on('notification').subscribe((notification: any) => {
            this.events.publish("actualizarNotificaciones");
            if (PRODUCCION == false) {
                this.servicioUtilidades.toast("¡Notificación recibida! App en primer plano: " + JSON.stringify(notification), "middle");
            }
        });
        return token;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Esto método intencionado para usarse en la aplicación web (se pone el código aquí para referencia).
    // El token se sacará del usuario, campo: "token".
    // Antes de usar método, revisar si el usuario recibe notificaciones en el campo del usuario: "recibe_notificacion",
    // ya que si no se revisa esto, aunque el usuario haya cerrado sesión, se le seguirán mandando.
    public async enviarNotificacionPushAsync(titulo: string, contenido: string, token_usuario: string) {

        let headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": "key=AAAAtc9c4ls:APA91bGs6HHVYqyUzlLxkH7obv_ilNlvYArTUUARgGZYnSVePxQzh4Zsly0dBTcd5VwDyfemPc_N3oZia_9zCIzk6TcHKIvTMZ1MFGrVgAVoC_naRGsenvUhzF2Y4trnFernNd85zLtg"
        });
        let options = { headers: headers };
        let datos = {
            to: token_usuario,
            notification: {
                title: titulo,
                body: contenido,
            },
            priority: "high"
        }
        let datosJSON = JSON.stringify(datos);


        let url = "https://fcm.googleapis.com/fcm/send";
        let respuesta = await new Promise<any>(resolve => {
            let susb = this.http.post(url, datosJSON, options).subscribe((resp: any) => {
                susb.unsubscribe();
                if (resp.success != null && resp.success) {
                    return resolve(<any>{
                        exito: true,
                        respuesta: resp,
                        mensaje: "notificación enviada."
                    });
                } else {
                    return resolve(<any>{
                        exito: false,
                        respuesta: JSON.stringify(resp),
                        mensaje: "Token no registrado, no fue posible enviar la notificación."
                    });
                }
            }, err => {
                susb.unsubscribe();
                return resolve(<any>{
                    exito: false,
                    respuesta: JSON.stringify(err),
                    mensaje: "Error desconocido, no fue posible enviar la notificación."
                });
            });
        });
        console.log("respuesta notificaciones");
        console.log(respuesta);

        if (PRODUCCION == false) {
            if (respuesta.exito == true)
                this.servicioUtilidades.toast("¡Exito! Notificacion de prueba enviada", "top");

            if (respuesta.exito == false)
                this.servicioUtilidades.alerta("¡Error! Notificacion de prueba:", respuesta.respuesta);
        }
        return respuesta;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async probarNotificacion(usuario: UsuarioModel) {
        if (usuario == null || usuario.token == null) {
            this.servicioUtilidades.toast("Error test notificacion, usuario o token nulo", "top")
            return;
        }
        await this.enviarNotificacionPushAsync("¡Bienvenido!", "Esta es una prueba de notificación push", usuario.token);
    }


    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public mostrarNumeroXNotificacion(items: number) {
        this.badge.set(items)
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async limpiarNumeroXNotificacion(items: number) {
        if (items != 0) {
            this.badge.clear();
        }
    }
}