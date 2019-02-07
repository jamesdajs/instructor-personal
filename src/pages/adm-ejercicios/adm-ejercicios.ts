import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController,ToastController} from 'ionic-angular';

import { RutinaProvider } from "../../providers/rutina/rutina"
import { AdmModejercicioPage } from "../adm-modejercicio/adm-modejercicio"
import { AdmCrearejercicioPage } from "../adm-crearejercicio/adm-crearejercicio"
import { DetallejercicioPage } from "../detallejercicio/detallejercicio"

/**
 * Generated class for the AdmEjerciciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-ejercicios',
  templateUrl: 'adm-ejercicios.html',
})
export class AdmEjerciciosPage {
nombre
list=[]
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rutina:RutinaProvider,
    private alert:AlertController,
    private toastCtrl:ToastController) {
    this.nombre=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmEjerciciosPage');
    this.cargardatos()
  }
  cargardatos(){
    this.rutina.verMisEjercicios(this.nombre)
    .subscribe(data=>{
      this.list=data
      //console.log(data)
    })
  }
  verDetalleEjercicio(item){
    console.log(item)
    this.navCtrl.push(DetallejercicioPage,item)
  }
  crear(){
    this.navCtrl.push(AdmCrearejercicioPage,this.nombre)
  }
  editar(item){
    this.navCtrl.push(AdmModejercicioPage,item)
  }
  eliminar(key){
    const toast = this.toastCtrl.create({
      message: 'Se elimino correctamente el ejercicio',
      duration: 3000})
    let alert = this.alert.create({
      title: 'Eliminar ejercicio',
      message: 'Seguro que desea eliminar el ejericicio?',
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
            this.rutina.eliminarEjercicio(key)
          .then(()=>{
            toast.present()
          })
          .catch(err=>{
            toast.setMessage("No se puedo eliminar el ejercicio")
            toast.present()
          })
          }
        }
      ]
    })
    alert.present()
    
  }
  
}
