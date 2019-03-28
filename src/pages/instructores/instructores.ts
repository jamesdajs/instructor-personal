import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, Platform } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario'
import { DatosinstructorPage } from '../../pages/datosinstructor/datosinstructor'

import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user:UsuarioProvider,
    private store:Storage,
    private platform:Platform,
   // private loadctrl:LoadingController,
    private toastctrl:ToastController,
    //private event:Events,
    private splashscreen:SplashScreen
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
    //this.store.clear()
  }
  unregisterBackButtonAction:any
  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
        console.log('Prevent Back Button Page Change');
        alert('Prevent Back Button Page Change');
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
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
}
