import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
//import { CrearusuarioPage} from '../crearusuario/crearusuario'
import { TabsPage} from '../tabs/tabs'
import { InstructorPage} from '../instructor/instructor'

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AuthFacebookProvider } from '../../providers/authfacebok/authfacebok';

import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  estado=false
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private auth:AuthFacebookProvider,
    private user:UsuarioProvider,
    private loadctrl:LoadingController,
    private splash:SplashScreen,
    private store:Storage
    ) {
  }
  

  ionViewDidLoad() {
    this.versiestalog()
    console.log('ionViewDidLoad LoginPage');
  }
  versiestalog(){
    
console.log("splas abierto")
    this.user.VerSiestaLogeado()
    .then(res=>{
      if(res){
        this.store.get("rol")
        .then(rol=>{
          if(rol=="alumno")this.navCtrl.setRoot(TabsPage)
          else this.navCtrl.setRoot(InstructorPage)
          
          //this.splash.show()
            console.log("splas cerado")
        })
        
      }else{
        this.splash.hide()
      }
      
    })
  }
  iniciarSesion(){
    
  }
  /*cargaDeDatos(cargar):void{
    const toast = this.toastCtr.create({
      message: 'carga de datos correcta',
      duration: 3000
    })

    this.user.leermisdatosPromesa() 
      .then( res =>{
        let edad=this.convertirfecha(res.fechanac)
        this.navCtrl.setRoot(DatospersonalesPage,{res:res,edad:edad})
        cargar.dismiss()
        //console.log(this.datos)
      })

    
  }
  convertirfecha(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"-"+(fecha.getMonth()<9?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getFullYear()
    }else{
      return null
    }
  }*/
  loginWithFacebook(): void {
    const cargar= this.loadctrl.create({
      content: "Cargando datos...",
    })
    cargar.present()
    this.conectarFacebook()
    .then(res=>{
      console.log(res)
      this.store.set("rol","alumno")
      this.navCtrl.setRoot(TabsPage)
      cargar.dismiss()
    })
    .catch(err=>{
      alert(err)
      cargar.dismiss()
    })
  }
  loginWithFacebook2() {
    console.log(this.estado)
      
  }
  conectarFacebook(){
    return new Promise((resolve,reject)=>{
      this.auth.loginWithFacebook().subscribe(data => {
        console.log(data)
        if (!this.estado) {
             this.user.verSitienenDatos()
             .then(datos=>{
                 if(datos===undefined){
                   
                  let perfilFB=data
                       if(perfilFB.first_name===undefined)perfilFB.displayName=""
                       if(perfilFB.perfilFB.last_name===undefined)perfilFB.perfilFB.last_name=""
                       if(perfilFB.middle_name===undefined)perfilFB.middle_name=""
                       let datos={
                         nombres:perfilFB.first_name +' '+perfilFB.middle_name,
                         apellidos:perfilFB.last_name,
                         email:perfilFB.email,
                         foto:perfilFB.photoURL,
                         instructor:false,
                         descorta:"",
                         fullname:perfilFB.displayName
                       }
                       this.user.crearusuario(perfilFB.uid,datos)
                       .then(()=>{
                         resolve('datos creados correctos')
                       })
                     
                   }else {
                     this.user.modusuario({
                      foto:data.photoURL})
                      .then(()=>{
                        resolve("ya se crearon datos antes")
                      })
                    }
                   
                 }).catch(error=>{
                  reject(error)
                 })
               
             }
      }, error=>{
        //console.log(error);
        reject(error)
      });
    })
  }
}
