import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,normalizeURL  } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera,CameraOptions } from '@ionic-native/camera';

import { AngularFireStorage } from 'angularfire2/storage';
import { UsuarioProvider } from '../../providers/usuario/usuario';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
/**
 * Generated class for the CrearusuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crearusuario',
  templateUrl: 'crearusuario.html',
})
export class CrearusuarioPage {
  downloadURL: Observable<string>;
  public imagen64:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    public camera:Camera,
    public toastCtrl: ToastController,
    public storage:AngularFireStorage,
public firebaseService: UsuarioProvider) {
  }
  public event = {
    month: '1990-03-03',
    timeStarts: '07:43',
    timeEnds: '1990-03-03'
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrearusuarioPage');
  }
  GurdarDatos(){
    this.navCtrl.setRoot(TabsPage)
  }
  openImagePickerCrop(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], {quality: 75}).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage);
                  },
                  error => console.error("Error cropping image", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
}
  uploadImageToFirebase(image){
    image = normalizeURL(image);
    //uploads img to firebase storage
    this.firebaseService.uploadImage(image)
    .then(photoURL => {
      let toast = this.toastCtrl.create({
        message: 'Image was updated successfully'+photoURL,
        duration: 3000
      });
    toast.present();
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: err,
        duration: 3000
      });
    toast.present();
  })
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
  guardar__datos(){

    this.uploadImgB64('daniel.jpeg',this.imagen64).then(url=>{
      console.log(url)
      
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
