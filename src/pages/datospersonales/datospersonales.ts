import { Component } from '@angular/core';
import { 
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  AlertController,
  ActionSheetController
} from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AuthFacebookProvider } from '../../providers/authfacebok/authfacebok';
//import { LoginPage} from '../login/login'
import { ModificarusuarioPage } from '../modificarusuario/modificarusuario';
//import { InstructoresPage } from '../instructores/instructores';

import { Storage } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { AdmCrearpublicasionPage } from '../adm-crearpublicasion/adm-crearpublicasion';
import { AdmModpublicacionPage } from '../adm-modpublicacion/adm-modpublicacion';
import { AngularFireStorage } from 'angularfire2/storage';

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
    nombre: "",
    foto:"",
    peso:null,
    altura:0,
    telefono:0,
    genero:null,
    fechanac:null,
    instructor:null,
    descorta:""
    
  }
  verdatos=true
  datosins={
    cursos:"",
    descorta:"",
    deslarga:""
  }
  rol
  edad=""
  edad2=""
  activador=false
  publicaciones=[]
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtr:ToastController,
    public loadCtr:LoadingController,
    private user: UsuarioProvider,
    private auth:AuthFacebookProvider,
    private alert:AlertController,
    //private event:Events,
    private store:Storage,
    private splash:SplashScreen,
    public storage:AngularFireStorage,
    public actionSheetCtrl: ActionSheetController
    ) {
    //this.datos=this.navParams.data.res
    //this.edad=this.navParams.data.edad
    this.store.get("rol").then(rol=>{
      this.rol=rol
    })
    this.user.leerMisdatosinstructor()
    .subscribe(data=>{
      this.datosins=data
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatospersonalesPage');
    //console.log(this.datos)
    this.cargaDeDatos()
    this.verMispublicaciones()
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
            subTitle: 'Porfavor actualize sus datos para optener una mejor experiencia en la aplicasion',
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
        console.log(this.datos)
      })

    
  }
  activarmodificardatos(){
    this.activador=!this.activador
    console.log(this.activador)
  }
  cerrarSesion(){
  
      let alert = this.alert.create({
        title: 'Cerrar Sesion',
        message: 'Seguro que desea salir de la aplicación?',
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
              this.store.clear()
              this.auth.logout()
              this.splash.show()
              
              //this.event.publish("irAinicio")
              
              window.location.reload();
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

        //console.log(this.datos.fechanac,this.edad2)
        let func=[
          this.user.crearusuario(id,this.datos)
        ]
        if(this.rol=="instructor")
          func.push(this.user.creardatosInstructor(this.datosins))
        Promise.all(func)
        .then(()=>{

          console.log("Usuario modificado correctamente")
          toast.present()
          this.activador=false
        })
      })
    }
  convertirfecha(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"-"+(fecha.getMonth()<10?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getFullYear()
    }else{
      return null
    }
  }
  convertirfecha2(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getFullYear()+"-"+(fecha.getMonth()<10?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+(fecha.getDate()<9?"0"+(fecha.getDate()):(fecha.getDate()))
    }else{
      return null
    }
  }
  modificardatos(){
    let datos={
      fechanac: this.convertirfecha2(this.datos.fechanac),
      peso:this.datos.peso,
      altura:this.datos.altura,
      genero:this.datos.genero,
      telefono:this.datos.telefono,
      instructor:this.datos.instructor,
      descorta:this.datos.descorta
      }
    if(this.rol=="instructor"){

      this.navCtrl.push(ModificarusuarioPage,{datos:datos,datosins:this.datosins,rol:this.rol})
    }else{
      
    this.navCtrl.push(ModificarusuarioPage,{datos:datos,rol:this.rol})
    }

  }
  canbiarRolIst(){
    this.store.get("rol").then(rol=>{
      if(rol!="instructor"){
        
        this.store.set("rol","instructor")
        if(!this.datos.instructor){
          this.alert.create({
            title: 'Cambiar de rol',
            message: 'El modo instructor esta activo de forma de prueva en la version actual',
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
                  let funciones=[]
                  funciones.push(this.user.modusuario({instructor:true}))
                  funciones.push(this.user.creardatosInstructor({cursos:"",descorta:"",deslarga:""}))
                  Promise.all(funciones)
                  .then(()=>{
                    this.splash.show()
                    window.location.reload();
        
                    location.reload(true);
                  })
                  .catch(err=>{
                    console.log(err)
                  })
                }
              }
            ]
          }).present();
        }else{
          this.splash.show()
          window.location.reload();
        
          location.reload(true);
        }
      }
        
        
    })
    
    //this.event.publish('cambiar a instructor')
  }
  canbiarRolAlum(){
    
    this.store.get("rol").then(rol=>{
      if(rol!="alumno"){
        this.store.set("rol","alumno")
        this.splash.show()
        location.reload(true);
        window.location.reload();
      }
        
    
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
  mostrardatos(){
    this.verdatos=!this.verdatos
  }
  crearPublicasion(){
    this.navCtrl.push(AdmCrearpublicasionPage,this.datos)
  }
  verMispublicaciones(){
    this.user.listarMisPublicasion()
    .subscribe(data=>{
      this.publicaciones=data
    })
  }
  verimagen(p,imgact){
    let mes=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."]
    let hoy=new Date()
    let prefi=""
        let diap=p.fecha.toDate()
        if(diap.getDate()==hoy.getDate() && 
        diap.getMonth()==hoy.getMonth() &&
        diap.getFullYear()==hoy.getFullYear()
        )
          prefi="Hoy "
        else if(diap.getDate()+1==hoy.getDate() && 
        diap.getMonth()==hoy.getMonth() &&
        diap.getFullYear()==hoy.getFullYear())
          prefi="Ayer "
        else prefi=diap.getDate()+" de "+mes[diap.getMonth()]

        prefi=prefi+" "+ diap.getHours()+":"+(diap.getMinutes()<9?"0"+diap.getMinutes():diap.getMinutes())
    let img=`<div class="imgalerta">
              
              <img src='${imgact}'></img>
              
              <div class="texto">
                 <p class='palert'>${prefi}</p><p class='palert'>${p.comentario}</p>
              </div>
            </div>`
            
            
    this.alert.create({
      cssClass:" titulo ",
      //message:prefi ,
      subTitle:img,
      
      
    }).present();
  }
  opciones(p,img){
    this.actionSheetCtrl.create({
      buttons:[
        {
          text: 'Ver',
          role: 'destructive',

          handler: () => {
            console.log('Destructive clicked');
            this.verimagen(p,img)
          }
        },
        {
          text: 'Modificar',

          handler: () => {
            console.log('Archive clicked');
            let datos={
              key:p.key,
              comentario:p.comentario,
              imagenes:p.imagenes
            }
            this.navCtrl.push(AdmModpublicacionPage,datos)
          }
        },
        {
          text: 'Eliminar',

          handler: () => {
            console.log('Archive clicked');
            this.eliminarpubli(p)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).present()
  }
  eliminarpubli(p){
    let alert = this.alert.create({
      title: 'Eliminar publicacion',
      message: 'Seguro que desea eliminar esta publicacion?',
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
            for(let i in p.imagenes)
              this.storage.ref("publicaciones/"+p.key+'/'+p.imagenes[i].nombre).delete()
            this.user.eliminarPublicasion(p.key)
           
          }
        }
      ]
    });
    alert.present();
  }
}
