import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController,ToastController} from 'ionic-angular';

import { DietasProvider } from "../../providers/dietas/dietas"
import { AdmModdietaPage } from "../adm-moddieta/adm-moddieta"
import { AdmCreardietaPage } from "../adm-creardieta/adm-creardieta"
/**
 * Generated class for the AdmDietasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-dietas',
  templateUrl: 'adm-dietas.html',
})
export class AdmDietasPage {
  nombre
  list=[]
    constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private dieta:DietasProvider,
      private alert:AlertController,
      private toastCtrl:ToastController) {
      this.nombre=navParams.data
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad AdmEjerciciosPage');
      this.cargardatos()
    }
    crear(){
      this.navCtrl.push(AdmCreardietaPage,this.nombre)
    }
    cargardatos(){
      if(this.nombre=="despues del gym")
        this.nombre="desgym"
      this.dieta.verMisDietas(this.nombre)
      .subscribe(data=>{
        this.list=data
        //console.log(data)
      })
    }
    editar(item){
      this.navCtrl.push(AdmModdietaPage,item)
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
              this.dieta.eliminarDieta(key)
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
