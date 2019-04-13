import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController  } from 'ionic-angular';
import { finalize } from 'rxjs/operators';
//import { Observable } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { DietasProvider } from "../../providers/dietas/dietas"

import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
/**
 * Generated class for the AdmCreardietaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-creardieta',
  templateUrl: 'adm-creardieta.html',
})
export class AdmCreardietaPage {
  datos={
    nombre:"",
    descorta:"",
    deslarga:"",
    tipo:"",
    imagen:"",
  }
  imagen64=""
  uploadPercent
  downloadURL
  myForm:FormGroup
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera:Camera,
    private storage:AngularFireStorage,
    private dieta:DietasProvider,
    private loadCtrl:LoadingController,
    private toastCtrl:ToastController,
    private formb:FormBuilder
    ) {
      this.datos.tipo=navParams.data
      this.myForm = this.formb.group({
        nombre: ['', [Validators.required,Validators.maxLength(50)]],
        descripcion: ['', [Validators.required,Validators.maxLength(100)]],
        instrucciones: ['', [Validators.required,Validators.maxLength(300)]]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCrearejercicioPage');
    console.log(this.datos)
  }
  borrarimg(){
    this.imagen64=''
  }
  guardar(){
    
    if(this.myForm.invalid)
    {this.toastCtrl.create({
      message: 'Tiene que llenar todos los datos',
      duration: 3000}).present()
    }else{
      let load=this.loadCtrl.create({
          content: "Guardando datos...",
        })
        load.present()
      const toast = this.toastCtrl.create({
        message: 'Se creo correctamente la dieta',
        duration: 3000})
      
      this.dieta.crearDieta(this.datos)
      .then(res=>{
        //console.log(res)
        if(this.imagen64){
          this.uploadImgB64("dietas/"+res.id,this.imagen64).then(url=>{
            console.log(url)
            this.dieta.añadirfotoDieta(res.id,{imagen:url})
            .then(()=>{
              load.dismiss()
              toast.present()
              this.navCtrl.pop()
            })
          })
        }else{
          load.dismiss()
          toast.present()
          this.navCtrl.pop()
        }
      })
    }
  }
  //sibir foto
  seleccionarImagen(){
    const options: CameraOptions = {
      quality:75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true,
      targetHeight:300,
      targetWidth:300,

    }
     
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):

     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imagen64=base64Image;
    }, (err) => {
     // Handle error
    });
    
  }

  uploadImgB64(path:string,imageB64):Promise<any>{
    return new Promise((resolve, reject)=>{
      let ref=this.storage.ref(path)
      let task= ref.putString(imageB64,'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(data=>{
            console.log(data);
            resolve(data)
          })
        } )
    )
    .subscribe()
      });
  }
}
