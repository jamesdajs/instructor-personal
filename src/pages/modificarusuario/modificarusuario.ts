import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,ToastController } from 'ionic-angular';
import {UsuarioProvider} from '../../providers/usuario/usuario'

/**
 * Generated class for the ModificarusuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modificarusuario',
  templateUrl: 'modificarusuario.html',
})
export class ModificarusuarioPage {
  
  fechanac= '1990-03-03'
  public event = {
    fechanac: null,
    peso:null,
    altura:null,
    genero:"",
    telefono:null,
    instructor:null,
    descorta:""
  }
  datosins={
    descorta:"",
    deslarga:"",
    cursos:""
  }
  rol
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public user:UsuarioProvider,
    public loadCtrl:LoadingController,
    public toastCtrl:ToastController
    ) {
      this.event=this.navParams.data.datos
      this.rol=this.navParams.data.rol
      if(this.navParams.data.datosins)this.datosins=this.navParams.data.datosins
      if(this.navParams.data.datos.fechanac!==null)this.fechanac=this.navParams.data.datos.fechanac
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModificarusuarioPage');
    console.log(this.event)
  }
  GurdarDatos(){
  const toast = this.toastCtrl.create({
      message: 'Datos modificados correctamente',
      duration: 3000
    });
    const cargar= this.loadCtrl.create({
      content: "Cargando datos...",
    })
    cargar.present()
    //console.log(this.event)
    this.user.veriduser()
    .then(id=>{
      this.event.fechanac=new Date(this.fechanac)
      this.event.descorta=this.datosins.descorta
      let func=[
        this.user.crearusuario(id,this.event)
      ]
      if(this.rol=="instructor")
        func.push(this.user.creardatosInstructor(this.datosins))
      Promise.all(func)
      .then(()=>{

        console.log("Usuario modificado correctamente")
        toast.present()
        cargar.dismiss()
        this.navCtrl.pop()
      })
    })
  }
}
