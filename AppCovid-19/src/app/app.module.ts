import { MapsService } from './../services/maps.service';
import { SearchService } from './../services/search.service';
import { TabsPage } from './../pages/tabs/tabs';
import { StorageService } from './../services/storage.service';
import { TicketsService } from './../services/tickets.service';
import { VideoPlayer } from '@ionic-native/video-player';
import { FileOpener } from '@ionic-native/file-opener';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { MediaService } from './../services/media.service';
import { BannerService } from './../services/banner.service';
import { CatalogosService } from './../services/catalogos.service';
import { ExpandableComponent } from './../components/components-expandable/components-expandable';
import { Chooser } from '@ionic-native/chooser';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { LoginPage } from '../pages/login/login';
import { RegistroUsuarioPage } from '../pages/registro-usuario/registro-usuario';
import { RestablecerContraseniaPage } from '../pages/restablecer-contrasenia/restablecer-contrasenia';
import { CategoriasPage } from '../pages/categorias/categorias';
import { AngularFireModule } from 'angularfire2'
import { AngularFireStorageModule } from 'angularfire2/storage'
import { CONEXION_FIREBASE } from './ambiente';
import { MediaCapture } from '@ionic-native/media-capture';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Base64 } from '@ionic-native/base64';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { TicketsPage } from './../pages/tickets/tickets';
import { AgmCoreModule } from '@agm/core';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupByPipe } from '../utilities/groupby';
import { InstanciaPage } from '../pages/instancia/instancia';
import { InstanciaService } from '../services/instancia.service';
import { ServicioNotificaciones } from '../services/notificaciones.service';
import { Push } from '@ionic-native/push';
import { ServicioWeb } from '../services/web.service';
import { ServicioWebPms } from '../services/web-pms.servicio';
import { NotificacionesComponent } from '../components/notificaciones/notificaciones';
import { MisNotificacionesPage } from '../pages/mis-notificaciones/mis-notificaciones';
import { MiCuentaPage } from '../pages/mi-cuenta/mi-cuenta';
import { GoogleMapsComponent } from '../components/google-maps/google-maps'
import { MapaHospitalesPage } from '../pages/mapa-hospitales/mapa-hospitales';
import { ServicioDenue } from '../services/denue.service';
import { AvisosPage } from '../pages/avisos/avisos';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicioUtilidades } from '../services/utilidades.service';
import { ResultadoPage } from '../pages/resultado/resultado';
import { AvisoDetallePage } from '../pages/avisos/aviso-detalle/aviso-detalle';
import { CuidatePage } from '../pages/cuidate/cuidate';
import { ResultadoSeguimientoPage } from '../pages/resultado-seguimiento/resultado-seguimiento';
import { EncuestaActualizarPage } from '../pages/encuesta-actualizar/encuesta-actualizar';
import { PrimerEncuestaPage } from '../pages/primer-encuesta/primer-encuesta';
import { PrimerResultadoPage } from '../pages/primer-resultado/primer-resultado';
import { ComentariosPage } from '../pages/comentarios/comentarios';
import { ComentariosDetallePage } from '../pages/comentarios/comentarios-detalle/comentarios-detalle';
import { ServicioInactividad } from '../services/inactividad.service';
import { ListaPacientesPage } from '../pages/lista-pacientes/lista-pacientes';
import { DetallePacientePage } from '../pages/detalle-paciente/detalle-paciente';
import { Badge } from '@ionic-native/badge/ngx';
import { Filter } from '../utilities/filter';
import { NotificacionDetallePage } from '../pages/mis-notificaciones/notificacion-detalle/notificacion-detalle';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { PermisosPage } from '../pages/permisos/permisos';

@NgModule({
    declarations: [
        GoogleMapsComponent,
        MyApp,
        PermisosPage,
        LoginPage,
        RegistroUsuarioPage,
        RestablecerContraseniaPage,
        CategoriasPage,
        ExpandableComponent,
        TicketsPage,
        TabsPage,
        InstanciaPage,
        NotificacionesComponent,
        MisNotificacionesPage,
        MiCuentaPage,
        MapaHospitalesPage,
        AvisosPage,
        ResultadoPage,
        AvisoDetallePage,
        CuidatePage,
        ResultadoSeguimientoPage,
        EncuestaActualizarPage,
        PrimerEncuestaPage,
        PrimerResultadoPage,
        ComentariosPage,
        ComentariosDetallePage,
        DetallePacientePage,
        ListaPacientesPage,
        NotificacionDetallePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
            scrollAssist: false,
            autoFocusAssist: false
        }),
        AngularFireModule.initializeApp(CONEXION_FIREBASE),
        AngularFireStorageModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDSVmDjbmmdQD_3B5NEZcO5lNsujDMzO2g",
            libraries: ["places"]
        }),
        TooltipsModule.forRoot(),
        BrowserAnimationsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        PermisosPage,
        LoginPage,
        RegistroUsuarioPage,
        RestablecerContraseniaPage,
        CategoriasPage,
        TicketsPage,
        TicketsPage,
        TabsPage,
        InstanciaPage,
        NotificacionesComponent,
        MisNotificacionesPage,
        MiCuentaPage,
        MapaHospitalesPage,
        AvisosPage,
        ResultadoPage,
        AvisoDetallePage,
        CuidatePage,
        ResultadoSeguimientoPage,
        EncuestaActualizarPage,
        PrimerEncuestaPage,
        PrimerResultadoPage,
        ComentariosPage,
        ComentariosDetallePage,
        DetallePacientePage,
        ListaPacientesPage,
        NotificacionDetallePage
    ],
    providers: [
        StatusBar,
        Badge,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        FileTransfer,
        FileTransferObject,
        File,
        Camera,
        MediaCapture,
        StreamingMedia,
        Base64,
        AuthenticationService,
        Chooser,
        SearchService,
        PhotoViewer,
        FileOpener,
        VideoPlayer,
        CatalogosService,
        TicketsService,
        StorageService,
        MediaService,
        GroupByPipe,
        PhotoViewer,
        FileOpener,
        VideoPlayer,
        InstanciaService,
        Filter,
        BannerService,
        MapsService,
        ServicioNotificaciones,
        Push,
        ServicioWebPms,
        ServicioWeb,
        ServicioDenue,
        Geolocation,
        ServicioUtilidades,
        ServicioInactividad,
        AndroidPermissions
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
