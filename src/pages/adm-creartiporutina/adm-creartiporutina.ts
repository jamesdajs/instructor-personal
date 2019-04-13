import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,LoadingController } from 'ionic-angular';
import { RutinaProvider } from '../../providers/rutina/rutina'
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';

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
myForm:FormGroup
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rutina:RutinaProvider,
    private toastCtrl:ToastController,
    private loadCtrl:LoadingController,
    private formb:FormBuilder
    ) {
      this.myForm = this.formb.group({
        nombre: ['', [Validators.required,Validators.maxLength(50)]]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCreartiporutinaPage');
  }
  guardar(){
    const toast=this.toastCtrl.create({message:"El tipo de ejercicio ya existe",
    duration:3000})
    if(this.myForm.invalid){
      toast.setMessage("Tienen que colocar un nombre al tipo de ejercicio")
      toast.present()
    }else
    {
      const load=this.loadCtrl.create({
        content:"Guardando datos..."
      })
      load.present()
      let tiposdefault=['hombro','brazos','piernas']
      
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

}
