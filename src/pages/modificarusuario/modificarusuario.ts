import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,ToastController } from 'ionic-angular';
import {UsuarioProvider} from '../../providers/usuario/usuario'
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation'
declare var google: any;
/**
 * Generated class for the ModificarusuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modificarusuario',
  templateUrl: 'modificarusuario.html',
})
export class ModificarusuarioPage {
  
  fechanac= '1990-03-03'
  public event = {
    fechanac: null,
    peso:40,
    altura:120,
    genero:"Masculino",
    telefono:null,
    instructor:null,
    descorta:""
  }
  datosins={
    descorta:"",
    deslarga:"",
    cursos:"",
    nombregym:'',
    coordenadas:{
      lat:'',
      lng:'',
      zoom:''
    },
    direccion:''
  }
  rol
  myForm: FormGroup
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public user:UsuarioProvider,
    public loadCtrl:LoadingController,
    public toastCtrl:ToastController,
    public formb: FormBuilder,
    public geolocation:Geolocation
    ) {
      this.rol=this.navParams.data.rol
      if(this.navParams.data.datosins)this.datosins=this.navParams.data.datosins
      if(this.navParams.data.datos.fechanac!==null)
      {  this.fechanac=this.navParams.data.datos.fechanac 
        this.event=this.navParams.data.datos
      }
      this.myForm = this.formb.group({
        telefono: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(12)]]
      });
      
  }
  saveData(){
    alert(JSON.stringify(this.myForm.value));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModificarusuarioPage');
    console.log(this.event)
    this.loadMap()
  }
  GurdarDatos(){
    const toast = this.toastCtrl.create({
      message: 'Datos modificados correctamente',
      duration: 3000
    });
    const cargar= this.loadCtrl.create({
      content: "Cargando datos...",
    })
    if(this.myForm.valid){
      cargar.present()
      //console.log(this.event)
      
        this.user.veriduser()
        .then(id=>{
          this.event.fechanac=new Date(this.fechanac.replace(/-/g, '\/'))
          this.event.descorta=this.datosins.descorta
          let func=[
            this.user.crearusuario(id,this.event)
          ]
          if(this.rol=="instructor")
            func.push(this.user.creardatosInstructor(this.datosins))
              
            Promise.all(func)
            .then(()=>{
  
              console.log("Usuario modificado correctamente")
              toast.present()
              cargar.dismiss()
              this.navCtrl.pop()
            })
          
        })
    }else{
      toast.setMessage("Tiene datos no validos").present()
    }
  }
  async loadMap()  {
    // This code is necessary for browser
    let latlng={}
    console.log(this.datosins)
    if(!this.datosins.coordenadas){
      let resp= await this.geolocation.getCurrentPosition()
      latlng={lat:resp.coords.latitude, lng: resp.coords.longitude}
    }else{
      latlng={lat:this.datosins.coordenadas.lat, lng: this.datosins.coordenadas.lng}
    }
    let map
      map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
        zoom: this.datosins.coordenadas?this.datosins.coordenadas.zoom:12,
			  disableDefaultUI: true
      });
      var marker = new google.maps.Marker(
        {
          position:this.datosins.coordenadas?latlng:'',
          map: map,
        }
        )
      let geocoder = new google.maps.Geocoder;
      let _datosins=this.datosins
        map.addListener('click', function(event) {
          marker.setPosition(event.latLng)
          console.log(event)
          _datosins.coordenadas={
            lat:marker.getPosition().lat(),
            lng:marker.getPosition().lng(),
            zoom:map.getZoom()
          }
          geocoder.geocode({
            'location': event.latLng
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
      
                //alert('place id: ' + results[0].place_id);
                _datosins.direccion=results[0]['formatted_address'];
      
      
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });
        });
	}
}
