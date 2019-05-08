import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsuarioProvider} from "../../providers/usuario/usuario"
import { finalize } from 'rxjs/operators';
/**
 * Generated class for the AdmModpublicacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-modpublicacion',
  templateUrl: 'adm-modpublicacion.html',
})
export class AdmModpublicacionPage {
  imagen64=""
  myForm:FormGroup
  datos={
    comentario:"",
    imagenes:[],
    titulo:"",
    costo:0,
    semanas:"",
    meses:"",
  }
  key=""
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage:AngularFireStorage,
    public toastCtrl:ToastController,
    public camera:Camera,
    public formb:FormBuilder,
    public user:UsuarioProvider,
    public loadCtrl:LoadingController

    ) {
      this.datos.comentario=navParams.data.comentario
      this.datos.imagenes=navParams.data.imagenes
      this.datos.titulo=navParams.data.titulo
      this.datos.costo=navParams.data.costo
      this.datos.semanas=navParams.data.semanas
      this.datos.meses=navParams.data.meses
      this.key=navParams.data.key
      this.myForm = this.formb.group({
        comentario: ['', [Validators.required,Validators.maxLength(300)]],
        costo: ['', [Validators.required,Validators.maxLength(300)]],
        titulo:['', [Validators.required,Validators.maxLength(300)]]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmModpublicacionPage');
  }
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
  guardar(){
  if(this.myForm.invalid )
  {this.toastCtrl.create({
    message: 'Tiene que llenar todos los datos',
    duration: 3000}).present()

  }else
    this.user.cambiarEstadoPublicasion()
    .then(()=>{
      
        let load=this.loadCtrl.create({
            content: "Guardando datos...",
          })
          load.present()
        const toast = this.toastCtrl.create({
          message: 'Se modifico correctamente  la publicacion',
          duration: 3000})
        
        this.user.modPublicasion(this.key,this.datos)
        .then(res=>{
          //console.log(res)
          if(this.imagen64!="")
          this.uploadImgB64("publicaciones/"+this.key,this.imagen64)
            .then(url=>{
              console.log(url)
  
                load.dismiss()
                toast.present()
                this.navCtrl.pop()
              
            })
          else{
            load.dismiss()
                toast.present()
                this.navCtrl.pop()
          }
          
        }).catch(err=> {
          load.dismiss()
          alert(JSON.stringify(err))
        })
      
    })
    
    
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
