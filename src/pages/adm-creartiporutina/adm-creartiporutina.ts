import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,LoadingController } from 'ionic-angular';
import { RutinaProvider } from '../../providers/rutina/rutina'

/**
 * Generated class for the AdmCreartiporutinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-creartiporutina',
  templateUrl: 'adm-creartiporutina.html',
})
export class AdmCreartiporutinaPage {
nombre =""
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rutina:RutinaProvider,
    private toastCtrl:ToastController,
    private loadCtrl:LoadingController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCreartiporutinaPage');
  }
  guardar(){
    const load=this.loadCtrl.create({
      content:"Guardando datos..."
    })
    load.present()
    let tiposdefault=['hombro','brazos','piernas']
    const toast=this.toastCtrl.create({message:"El tipo de ejercicio ya existe",
                                    duration:3000})
    this.rutina.versiexisteTipoEjercicio(this.nombre)
    .then(datos=>{
    console.log(datos,datos.length)
    
    console.log(tiposdefault.indexOf(this.nombre))
      if(datos.length!=0 || tiposdefault.indexOf(this.nombre)!=-1){
        toast.present()
        
        load.dismiss()
      }else{
        this.rutina.creartipoEjercicio({nombre:this.nombre})
        .then(()=>{

          toast.setMessage("tipo de ejercicio creado correctamente")
          toast.present()
          this.navCtrl.pop()
          load.dismiss()
        })
      }
    })
  }

}
