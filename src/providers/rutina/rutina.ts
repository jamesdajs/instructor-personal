//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from 'rxjs/Observable';

import {AngularFireAuth} from '@angular/fire/auth';
import { map } from "rxjs/operators";
/*
  Generated class for the RutinaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RutinaProvider {

  constructor(private db: AngularFirestore,
    private auth:AngularFireAuth
    ) {
    console.log('Hello RutinaProvider Provider');
  }
  
  private getcollArrayconkey(coll,query?):Observable<any>{
    return this.db.collection(coll,query)
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }
  private  getcollitem(coll,key):Observable<any>{
    return this.db.collection(coll).doc(key)
    .valueChanges()
  }
  private  getcollitemquery(coll,query?):Observable<any>{
    return this.db.collection(coll,query)
    .valueChanges()
  }
  //ejercicios
  crearEjercicio(data){
    data["idinstructor"]=this.auth.auth.currentUser.uid
    return this.db.collection("ejercicios").add(data)
  }
  
  listaMisTipoEjercicio(){
    let query=res=>res.where("idinstructor","==",this.auth.auth.currentUser.uid)
    return this.getcollArrayconkey("tipoejercicio",query)
  }
  creartipoEjercicio(data){
    data["idinstructor"]=this.auth.auth.currentUser.uid
    return this.db.collection("tipoejercicio").add(data)
  }
  modiTipoEjercicio(id,data){
    return this.db.collection("tipoejercicio").doc(id).set(data,{ merge: true })
  }
  eliminarTipoEjercicio(id){
    return this.db.collection("tipoejercicio").doc(id).delete()
  }
  versiexisteTipoEjercicio(nombre):any{
    let query=res=>res.where("idinstructor",'==',this.auth.auth.currentUser.uid)
                      .where("nombre","==",nombre)
    return new Promise((res,rej)=>{

      this.getcollArrayconkey("tipoejercicio",query)
      .subscribe(data=>{
        res(data)
      },rej)
    })
  }
  añadirfotoEjercicio(id,data){
    return this.db.collection("ejercicios").doc(id).set(data,{ merge: true })
  }
  eliminarEjercicio(id){
    return this.db.collection("ejercicios").doc(id).delete()
  }
  modificarEjercicio(id,data){
    return this.db.collection("ejercicios").doc(id).set(data,{ merge: true })
  }
  modificarEjercicioRutina_ejer(idejer,data){
    return this.db.collection("rutina_ejer").doc(idejer).set(data,{ merge: true })
  }
  listaRutinas_ejer(keyejer){
    let query=res=>res.where("idejercicio","==",keyejer)
    return this.getcollArrayconkey("rutina_ejer",query)
  }
  //rutinas
  verRutinas(keyins){
    let query=res => res.where("estado", "==", false).where("idinstructor","==",keyins)
    
    return this.getcollArrayconkey("cliente/"+this.auth.auth.currentUser.uid+"/rutinas",query)
  }
  verRutinasins(keyins){
    let query=res => res.where("estado", "==", false).where("idinstructor","==",this.auth.auth.currentUser.uid)
    
    return this.getcollArrayconkey("cliente/"+keyins+"/rutinas",query)
  }
  verRutinasinstodos(keyins){
    let query=res => res.where("idinstructor","==",this.auth.auth.currentUser.uid)
    
    return this.getcollArrayconkey("cliente/"+keyins+"/rutinas",query)
  }
  asignar_rutina_defecto(keycli,datos,keyrut){
    
      datos["idinstructor"]=this.auth.auth.currentUser.uid
      datos["estado"]=false
      return this.db.collection(`cliente/${keycli}/rutinas`).doc(keyrut).set(datos)
    
  } 
  verRutinasDefecto(){
    let query=res => res.where("estado", "==", true)
    
    return this.getcollArrayconkey(`cliente/${this.auth.auth.currentUser.uid}/rutinasdefecto`,query)
  }
  verEjercicios(keyrut){
    let query=res=>res.where("idrutina","==",keyrut)
    return this.getcollArrayconkey("rutina_ejer",query)
  }
  verMisEjercicios(tipo){
    let query=res=>res.where("idinstructor","==",this.auth.auth.currentUser.uid).where("tipo","==",tipo)
    return this.getcollArrayconkey("ejercicios",query)
  }
  verMisEjerciciostodo(){
    let query=res=>res.where("idinstructor","==",this.auth.auth.currentUser.uid)
    return this.getcollArrayconkey("ejercicios",query)
  }
  verDetalleEjercicios(keyejer){
    return this.getcollitem("ejercicios",keyejer)
  }
  verDetalleRutina_Ejer(keyejer,keyrut){
    let query=res=>res.where("idrutina","==",keyrut)
                      .where("idejercicio","==",keyejer)
    return this.getcollitemquery("rutina_ejer",query)
  }
  crearsetsdeEjercicio(data){
    data["idcliente"]=this.auth.auth.currentUser.uid
    return this.db.collection("setejercicios").add(data)
  }
  versetdeHoy(idejer,idrutina){
    let f = new Date();
    let fecha=(f.getMonth() +1)+ "/" + f.getDate() + "/" + f.getFullYear()
    console.log(fecha)
    let query=res => res.where("idejercicio", "==", idejer)
                        .where("idrutina","==",idrutina)
                        .where("fecha","==",new Date(fecha))
    
    return this.getcollArrayconkey("setejercicios",query)
  }
  verHistorial(idejer){
    let query=res => res.where("idejercicio", "==", idejer)
                      .where("idcliente","==",this.auth.auth.currentUser.uid)
                        .orderBy("fecha","desc")
    
    return this.getcollArrayconkey("setejercicios",query)
  }

}