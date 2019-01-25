import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,AlertController,ToastController } from 'ionic-angular';
import { RutinaProvider} from '../../providers/rutina/rutina'
/**
 * Generated class for the AdmAñadirejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-añadirejercicio',
  templateUrl: 'adm-añadirejercicio.html',
})
export class AdmAñadirejercicioPage {
ejercicios=[]
ejerselec=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private view:ViewController,
    private rutina:RutinaProvider,
    private alertCtrl:AlertController,
    private toastCtrl:ToastController
    ) {
      this.ejerselec=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmAñadirejercicioPage');
    this.cargardatos()
  }
  dismiss(){
    this.view.dismiss(this.ejerselec)
  }
  cargardatos(){
    this.rutina.verMisEjerciciostodo()
    .subscribe(data=>{
      data.forEach(element => {

            element["estadoadd"]=true
        
      });
      data.forEach(element => {
        this.ejerselec.forEach(sel => {
          if(element["key"]==sel["key"])
            element["estadoadd"]=false
        });
      });
      this.ejercicios=data
      console.log(this.ejercicios)
    })
  }
  solicitud(item,i){
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'peso',
          placeholder: 'Peso en kg',
          type:"number",
          min:0,
          max:300
        },
        {
          name: 'repeticiones',
          placeholder: 'Repeticiones',
          type: 'text'
        },
        {
          name: 'duracion',
          placeholder: 'Duracion en min',
          type: 'number',
          min:0,
          max:180
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            if(data.peso=="" && data.duracion=="" && data.repeticiones==""){
              this.toastCtrl.create({
                message:"Tiene que llenar al menos un campo",
                duration:3000
              }).present()
              return false
            }
            else{
              
              console.log(item,i)
              let dato:any={}
              for(let j in item){
                  dato[j]=item[j]
              }
              dato["peso"]=data.peso
              dato["duracion"]=data.duracion
              dato["repeticiones"]=data.repeticiones
              dato["idejercicio"]=dato.key
              dato["key"]
              item.estadoadd=false
              this.ejerselec.push(dato)
            }
          }
        }
      ]
    });
    alert.present();
    

  }

}
