import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { CrearusuarioPage } from '../pages/crearusuario/crearusuario';

import { RutinasPage } from '../pages/rutinas/rutinas';
import { DietasPage } from '../pages/dietas/dietas';
import { EstadisticasPage } from '../pages/estadisticas/estadisticas';
import { DatospersonalesPage } from '../pages/datospersonales/datospersonales';
import { EjerciciosPage } from '../pages/ejercicios/ejercicios';
import { DetallejercicioPage } from '../pages/detallejercicio/detallejercicio';
import { ModificarusuarioPage } from '../pages/modificarusuario/modificarusuario';
import { InstructoresPage } from '../pages/instructores/instructores';
import { DetalledietaPage } from '../pages/detalledieta/detalledieta';
import { DatosinstructorPage } from '../pages/datosinstructor/datosinstructor';
//tab adm y pages
import { InstructorPage } from '../pages/instructor/instructor';

import { AdmEjerciciosPage } from '../pages/adm-ejercicios/adm-ejercicios';
import { AdmCrearejercicioPage } from '../pages/adm-crearejercicio/adm-crearejercicio';
import { AdmTipoejercicioPage } from '../pages/adm-tipoejercicio/adm-tipoejercicio';
import { AdmModejercicioPage } from '../pages/adm-modejercicio/adm-modejercicio';
import { AdmTipodietaPage } from '../pages/adm-tipodieta/adm-tipodieta';
import { AdmDietasPage } from '../pages/adm-dietas/adm-dietas';
import { AdmCreardietaPage } from '../pages/adm-creardieta/adm-creardieta';
import { AdmModdietaPage } from '../pages/adm-moddieta/adm-moddieta';
import { AdmClientesPage } from '../pages/adm-clientes/adm-clientes';
import { AdmDatosclientePage } from '../pages/adm-datoscliente/adm-datoscliente';
import { AdmRutinasclientePage } from '../pages/adm-rutinascliente/adm-rutinascliente';
import { AdmCrearrutinaclientePage } from '../pages/adm-crearrutinacliente/adm-crearrutinacliente';
import { AdmAñadirejercicioPage } from '../pages/adm-añadirejercicio/adm-añadirejercicio';
import { AdmDietasclientePage } from '../pages/adm-dietascliente/adm-dietascliente';
import { AdmCreardietaclientePage } from '../pages/adm-creardietacliente/adm-creardietacliente';
import { AdmAsignardietaclientePage } from '../pages/adm-asignardietacliente/adm-asignardietacliente';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { MediaCapture } from '@ionic-native/media-capture';
//configuracion fb
import { Facebook } from '@ionic-native/facebook';
//import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from "./app.config";
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFirestoreModule } from "angularfire2/firestore";

import { AngularFireStorageModule } from 'angularfire2/storage';


//provider
import { UsuarioProvider } from '../providers/usuario/usuario';
import { RutinaProvider } from '../providers/rutina/rutina';


import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { AuthFacebookProvider } from '../providers/authfacebok/authfacebok';

import { IonicStorageModule } from '@ionic/storage';
import { DietasProvider } from '../providers/dietas/dietas';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    CrearusuarioPage,
    RutinasPage,
    DietasPage,
    EstadisticasPage,
    DatospersonalesPage,
    EjerciciosPage,
    DetallejercicioPage,
    ModificarusuarioPage,
    InstructoresPage,
    DetalledietaPage,
    DatosinstructorPage,
    InstructorPage,

    AdmEjerciciosPage,
    AdmCrearejercicioPage,
    AdmTipoejercicioPage,
    AdmModejercicioPage,
    AdmTipodietaPage,
    AdmDietasPage,
    AdmCreardietaPage,
    AdmModdietaPage,
    AdmClientesPage,
    AdmDatosclientePage,
    AdmRutinasclientePage,
    AdmCrearrutinaclientePage,
    AdmAñadirejercicioPage,
    AdmDietasclientePage,
    AdmCreardietaclientePage,
    AdmAsignardietaclientePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
        monthNames: ['Enero', 
                    'Febrero', 
                    'Marzo', 
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre" ],
        monthShortNames: ['Ene', 'Feb', 'Mar', "Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
        dayNames: ['Domingo', 'Lunes',
                   'Martes', "Miercoles","Jueves","Viernes","Sabado" ],
        dayShortNames: ['Dom', 'Lun', 'Mar', "Mie","Jue","Vie","Sab" ]
    }),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    CrearusuarioPage,
    RutinasPage,
    DietasPage,
    EstadisticasPage,
    DatospersonalesPage,
    EjerciciosPage,
    DetallejercicioPage,
    ModificarusuarioPage,
    InstructoresPage,
    DetalledietaPage,
    DatosinstructorPage,
    InstructorPage,

    AdmEjerciciosPage,
    AdmCrearejercicioPage,
    AdmTipoejercicioPage,
    AdmModejercicioPage,
    AdmTipodietaPage,
    AdmDietasPage,
    AdmCreardietaPage,
    AdmModdietaPage,
    AdmClientesPage,
    AdmDatosclientePage,
    AdmRutinasclientePage,
    AdmCrearrutinaclientePage,
    AdmAñadirejercicioPage,
    AdmDietasclientePage,
    AdmCreardietaclientePage,
    AdmAsignardietaclientePage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioProvider,
    RutinaProvider,
    ImagePicker,
    Crop,
    Camera,
    Facebook,
    AuthFacebookProvider,
    DietasProvider,
    MediaCapture,
    File
  ]
})
export class AppModule {}
