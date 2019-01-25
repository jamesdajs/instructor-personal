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
    telefono:null
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public user:UsuarioProvider,
    public loadCtrl:LoadingController,
    public toastCtrl:ToastController
    ) {
      console.log(this.navParams.data)
      this.event=this.navParams.data
      if(this.navParams.data.fechanac!==null)this.fechanac=this.navParams.data.fechanac
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModificarusuarioPage');
  }
  GurdarDatos(){
  const toast = this.toastCtrl.create({
      message: 'datos modificados correctamente',
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
      this.user.crearusuario(id,this.event)
      .then(()=>{
        console.log("usuario modificado correctamente")
        cargar.dismiss()
        toast.present()
        this.navCtrl.pop()
      })
    })
  }
}
