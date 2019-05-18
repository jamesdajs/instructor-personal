import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario'
import { DatosinstructorPage } from '../../pages/datosinstructor/datosinstructor'

import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { VercursoPage } from '../vercurso/vercurso';
/**
 * Generated class for the InstructoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-instructores',
  templateUrl: 'instructores.html',
})
export class InstructoresPage {
buscar=""
datosbuscado=[]
misInstructores=[]
keyslec
publicaciones=[]
num=3
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user:UsuarioProvider,
    private store:Storage,
   // private loadctrl:LoadingController,
    private toastctrl:ToastController,
    //private event:Events,
    private splashscreen:SplashScreen,
    public toastCtrl: ToastController
    ) {
      this.store.get("key1")
      .then(key=>{
        this.keyslec=key
      })
      //this.misInstructores=this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstructoresPage');
    this.vermisinstructores()
    this.lstarPublicaciones(this.num)
    //this.store.clear()
  }
  
  verInstructor(key){
    this.navCtrl.push(DatosinstructorPage,key)
  }
  getItems(){
    console.log(this.buscar)
    if(this.buscar!=''){
      this.user.buscarinstuctor(this.buscar.toLocaleLowerCase())
      .subscribe(res=>{
        console.log(res)
        this.datosbuscado=res
      },
      err=>{
        console.log(err)
      })
    }
    
  }
  vercurso(key){
    const toast = this.toastctrl.create({
      message: 'Se cargaron los datos del instructor de forma correcta',
      duration: 3000})
    this.store.get("key1")
    .then(res=>{
      if(res!=key){
        this.store.set('key1',key)
        .then(()=>{
          //this.event.publish("recargarTabs",{true:true})
          ///this.navCtrl.popToRoot()
          toast.present()
            this.splashscreen.show();
            //window.location.reload();
            location.reload(true);
          
          //this.navCtrl.setRoot(TabsPage)
        })
      }
    })
    
    
  }
  vermisinstructores():void{
    /*const cargar= this.loadctrl.create({
      content: "Cargando datos...",
    })
    cargar.present()*/
    this.user.verMisinstuctor()
    .subscribe(data=>{
      this.misInstructores=data
      console.log(data)
      //cargar.dismiss()
    },err=>{
      console.log(err)
    })
  }
  lstarPublicaciones(num,ref?){
    let mes=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."]
    let hoy=new Date()
    this.user.listarPublicasion(num)
    .subscribe(res=>{
      res.forEach(element => {
        let prefi=""
        let diap=element.fecha.toDate()
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

        element["fecha2"]=prefi+" "+ diap.getHours()+":"+(diap.getMinutes()<9?"0"+diap.getMinutes():diap.getMinutes())
      });
      //console.log((res.length-this.publicaciones.length)==3,res.length-3,res.length-(res.length-this.publicaciones.length))
      let aNuevo =res.length - this.publicaciones.length==3? res.slice(res.length-3):res.slice(res.length-(res.length-this.publicaciones.length))
      this.publicaciones=this.publicaciones.concat(aNuevo)

      console.log(res)
      if(ref) ref.complete()
    })
  }
  estadoToast=true;
  alerta(){
    const toast = this.toastCtrl.create({
      message: 'Esta sección listará a todos tus instructores personales, selecciona un instructor para ver sus rutinas y dietas que te asignó',
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });

    if(this.estadoToast){
      toast.present()
      this.estadoToast=false
    } 
    toast.onDidDismiss(() => {
      this.estadoToast=true
    });
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    
      console.log('Async operation has ended');
      setTimeout(()=>{

        this.lstarPublicaciones(refresher)
      },1000)
      
    
  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.num=this.num+3
      this.lstarPublicaciones(this.num,infiniteScroll)
    }, 500);
  }

  verCursoDetalle(key){
    console.log('key'+key);
    this.navCtrl.push(VercursoPage,key)
  }
}
