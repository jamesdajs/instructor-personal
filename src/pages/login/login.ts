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
  rol="alumno"
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
  loginWithGoogle(){
    this.auth.googleLogin()
    .then(res => {
      alert(JSON.stringify(res)+"todo ok")
      console.log(res)})
    .catch(err => {
      alert(JSON.stringify(err)+"errr")
      console.error(err)})
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
    this.user.leermisdatos()
      .subscribe(data=>{
        if(this.rol=="alumno"){
          this.store.set("rol",this.rol)
          this.navCtrl.setRoot(TabsPage)
        }else if(data.instructor){
          this.store.set("rol",this.rol)
          this.navCtrl.setRoot(InstructorPage)
        }else{
          alert("No tienen permiso para entrar como Instructor, automaticamnete entrara como alumno, Contactenos para entrar como instructor para el modo beta ")
          this.store.set("rol","alumno")
          this.navCtrl.setRoot(TabsPage)
        }

      })
      
      
      cargar.dismiss()
    })
    .catch(err=>{
      alert("Error de la coneccion de internet")
      console.log(err)
      cargar.dismiss()
    })
  }
  cambiarRolAlum(){
    this.rol="alumno"
  }
  cambiarRolIst(){
    //console.log(this.rol)
    this.rol="instructor"
  }
  loginWithFacebook2() {
    console.log(this.estado)
      
  }
  conectarFacebook(){
    return new Promise((resolve,reject)=>{
      this.auth.loginWithFacebook().subscribe(data => {
        //alert(JSON.stringify(data))
        console.log(data)
        if (!this.estado) {
          let datos={
            nombre:data.displayName,
            foto:data.photoURL,
            fullname:data.displayName.toLowerCase(),
            email:data.email
          }
          Promise.all([
            this.user.creardatosInstructor({
              descorta:"",
              deslarga:"",
              cursos:""
            }),
            this.user.crearusuario(data.uid,datos)
          ])
            .then(()=>{
              resolve('datos creados correctos')
            })
            }
      }, error=>{
        //console.log(error);
        reject(error)
      });
    })
  }
}
