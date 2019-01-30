import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { RutinaProvider } from '../../providers/rutina/rutina'

/**
 * Generated class for the AdmModtiporutinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-modtiporutina',
  templateUrl: 'adm-modtiporutina.html',
})
export class AdmModtiporutinaPage {
item={
  nombre:"",
  key:"",
  idinstructor:""
}
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public rutina:RutinaProvider,
    private toast:ToastController,
    private loadCtrl:LoadingController
    ) {
    this.item=this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmModtiporutinaPage');
    
    console.log(this.item)
  }
  Modificar(){
    const load=this.loadCtrl.create({
      content:"Guardando datos..."
    })
    load.present()
    let tiposdefault=['hombro','brazos','piernas']
    const toast=this.toast.create({message:"El tipo de ejercicio ya existe o no modificaste el nombre",
                                    duration:3000})
    this.rutina.versiexisteTipoEjercicio(this.item.nombre)
    .then(datos=>{
    console.log(datos,datos.length)
    
    console.log(tiposdefault.indexOf(this.item.nombre))
      if(datos.length!=0 || tiposdefault.indexOf(this.item.nombre)!=-1){
        toast.present()
        
        load.dismiss()
      }else{
        this.rutina.modiTipoEjercicio(this.item.key,{nombre:this.item.nombre,idinstructor:this.item.idinstructor})
        .then(()=>{

          toast.setMessage("tipo de ejercicio modificado correctamente")
          toast.present()
          this.navCtrl.pop()
          load.dismiss()
        })
      }
    })
    
  }

}
