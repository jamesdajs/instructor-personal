import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController } from 'ionic-angular';

import { RutinaProvider } from '../../providers/rutina/rutina'

import { AdmCreartiporutinaPage } from "../adm-creartiporutina/adm-creartiporutina"
import { AdmEjerciciosPage } from "../adm-ejercicios/adm-ejercicios"
import { AdmModtiporutinaPage } from "../adm-modtiporutina/adm-modtiporutina"
/**
 * Generated class for the AdmTipoejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-tipoejercicio',
  templateUrl: 'adm-tipoejercicio.html',
})
export class AdmTipoejercicioPage {
  tipoejer=[
    {nombre:"hombro"},
    {nombre:"brazos"},
    {nombre:"piernas"}
  ]
  tipos=[]
  list=[]
    constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public rutina:RutinaProvider,
      public alertCtrl:AlertController,
      private toastCtrl:ToastController
      ) {
        this.rutina.listaMisTipoEjercicio()
        .subscribe(data=>{
          this.tipos=data
        })
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad AdmtipoEjerciciosPage');
    }
 
    crear(){
      this.navCtrl.push(AdmCreartiporutinaPage)
    }
    verejercicios(item){
      this.navCtrl.push(AdmEjerciciosPage,item.nombre)
    }
    editar(item){
      this.navCtrl.push(AdmModtiporutinaPage,item)
    }
    eliminar(key){
      this.alertCtrl.create({
        title:"Eliminar tipo",
        message:`Seguro que desea eliminar el tipo de ejercicio?. 
        Si elimina ya no podra acceder a los ejercicios de este tipo`,
        inputs:[
          {
            name:'eliminarejer',
            type:'checkbox',
            label:'Eliminar los ejercicios enlazados a este tipo?',
            value:"borrar"
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              console.log(data)
              this.rutina.eliminarTipoEjercicio(key)
              .then(()=>{
                this.toastCtrl.create({
                  message:"Se elimino correctamente el tipo de ejercicio",
                  duration:3000
                }).present()
              })
            }
          }
        ]
      }).present()

    }
  }
