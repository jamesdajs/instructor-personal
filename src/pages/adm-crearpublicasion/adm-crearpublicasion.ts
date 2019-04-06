import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,ToastController } from 'ionic-angular';
import { finalize } from 'rxjs/operators';
import { Camera,CameraOptions } from '@ionic-native/camera';

import { AngularFireStorage } from '@angular/fire/storage';
import {UsuarioProvider} from '../../providers/usuario/usuario'

/**
 * Generated class for the AdmCrearpublicasionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-crearpublicasion',
  templateUrl: 'adm-crearpublicasion.html',
})
export class AdmCrearpublicasionPage {
  imagen64=""
  datos={
    comentario:"",
    fecha:new Date,
    estado:true
  }
  constructor(public navCtrl: NavController, public navParams: NavParams ,public camera:Camera,
  
    private storage:AngularFireStorage,
    private loadCtrl:LoadingController,
    private toastCtrl:ToastController,
    private user:UsuarioProvider
    ) {
      this.datos["nombre"]=navParams.data.nombre
      this.datos["foto"]=navParams.data.foto
      this.datos["telefono"]=navParams.data.telefono
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCrearpublicasionPage');
  }
  seleccionarImagen(){
    const options: CameraOptions = {
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
  this.user.cambiarEstadoPublicasion()
  .then(()=>{
    if(this.datos.comentario=="" && this.imagen64=="")
    {this.toastCtrl.create({
      message: 'tiene que llenar todos los datos',
      duration: 3000}).present()
    }else{
      let load=this.loadCtrl.create({
          content: "Guardando datos...",
        })
        load.present()
      const toast = this.toastCtrl.create({
        message: 'Se creo correctamente  la publicacion',
        duration: 3000})
      
      this.user.crearPublicasion(this.datos)
      .then(res=>{
        //console.log(res)
        this.uploadImgB64("publicasiones/"+res.id,this.imagen64)
          .then(url=>{
            console.log(url)
            this.user.modPublicasion(res.id,{imagen:url})
            .then(()=>{
              load.dismiss()
              toast.present()
              this.navCtrl.pop()
            })
          })
          
        
      }).catch(err=> {
        load.dismiss()
        alert(JSON.stringify(err))
      })
    }
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
