import { Component } from '@angular/core';
import { 
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  AlertController
} from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AuthFacebookProvider } from '../../providers/authfacebok/authfacebok';
//import { LoginPage} from '../login/login'
import { ModificarusuarioPage } from '../modificarusuario/modificarusuario';
//import { InstructoresPage } from '../instructores/instructores';

import { Storage } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * Generated class for the DatospersonalesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-datospersonales',
  templateUrl: 'datospersonales.html',
})
export class DatospersonalesPage {
  datos={
    email: "",
    nombres: "",
    apellidos: "",
    foto:"",
    peso:null,
    altura:0,
    telefono:0,
    genero:null,
    fechanac:null,
    
  }
  edad=""
  edad2=""
  activador=false
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtr:ToastController,
    public loadCtr:LoadingController,
    private user: UsuarioProvider,
    private auth:AuthFacebookProvider,
    private alert:AlertController,
    //private event:Events,
    private store:Storage,
    private splash:SplashScreen
    ) {
    //this.datos=this.navParams.data.res
    //this.edad=this.navParams.data.edad
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatospersonalesPage');
    //console.log(this.datos)
    this.cargaDeDatos()
  }
  cargaDeDatos(){
    /*const toast = this.toastCtr.create({
      message: 'carga de datos correcta',
      duration: 3000
    })*/

      this.user.leermisdatos()
      .subscribe( res =>{
        this.datos=res
        if(!res.peso||!res.altura||!res.telefono||!res.genero||!res.fechanac){
          let alert = this.alert.create({
            title: 'Datos Incompletos',
            subTitle: 'Porfavor actualize sus datos para mejores ...',
            buttons: ['Ok']
          });
          alert.present();
        }
        this.edad=this.convertirfecha(res.fechanac)
        this.edad2=this.convertirfecha2(res.fechanac)
        //carga de imagenes
        /*let img = document.querySelector('img'); 
          img.onload = function() {

        }*/
        //console.log(this.datos)
      })

    
  }
  activarmodificardatos(){
    this.activador=!this.activador
    console.log(this.activador)
  }
  cerrarSesion(){
  
      let alert = this.alert.create({
        title: 'Cerrar Sesion',
        message: 'Seguro que desea salir de la aplicasion?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: () => {
              this.auth.logout()
              this.splash.show()
              window.location.reload();
              //this.event.publish("irAinicio")
              this.store.clear()
              console.log(this.store.keys)
            }
          }
        ]
      });
      alert.present();
    


  }
  GurdarDatos(){
    const toast = this.toastCtr.create({
        message: 'Datos modificados correctamente',
        duration: 3000
      });
      //console.log(this.event)
      this.user.veriduser()
      .then(id=>{
        this.datos.fechanac=new Date(this.edad2.replace(/-/g, '\/'))

        console.log(this.datos.fechanac,this.edad2)
        this.user.crearusuario(id,this.datos)
        .then(()=>{
          console.log("usuario modificado correctamente")
          toast.present()
          this.activador=false
        })
      })
    }
  convertirfecha(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"-"+(fecha.getMonth()<9?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getFullYear()
    }else{
      return null
    }
  }
  convertirfecha2(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getFullYear()+"-"+(fecha.getMonth()<9?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getDate()
    }else{
      return null
    }
  }
  modificardatos(){
    this.navCtrl.push(ModificarusuarioPage,{
    fechanac: this.convertirfecha2(this.datos.fechanac),
    peso:this.datos.peso,
    altura:this.datos.altura,
    genero:this.datos.genero,
    telefono:this.datos.telefono
    })
  }
  canbiarRolIst(){
    this.store.set("rol","instructor")
    this.store.get("rol").then(rol=>{
      if(rol!="instructor")
        window.location.reload();
        
        location.reload(true);
    })
    
    //this.event.publish('cambiar a instructor')
  }
  canbiarRolAlum(){
    
    this.store.set("rol","alumno")
    this.store.get("rol").then(rol=>{
      if(rol!="alumno")
      
      location.reload(true);
      window.location.reload();
    })
    //this.event.publish("cambiar a alumno")
  }
  /*instructores():void{
    const cargar= this.loadCtr.create({
      content: "Cargando datos...",
    })
    cargar.present()
    this.user.verMisinstuctorPronesa()
    .then(data=>{
      this.navCtrl.push(InstructoresPage,data)
      cargar.dismiss()
    })
    .catch(err=>{console.log(err)})
    
  }*/

}
