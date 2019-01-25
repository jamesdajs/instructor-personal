import { Timestamp } from "rxjs/internal/operators/timestamp";


export const firebaseConfig = {
  production: false,
    firebase:{
      apiKey: "AIzaSyDv9zk84ed6_ckRorvxhVnTfecLs_aSbFw",
      authDomain: "entrenador-personal-20e1f.firebaseapp.com",
      databaseURL: "https://entrenador-personal-20e1f.firebaseio.com",
      projectId: "entrenador-personal-20e1f",
      storageBucket: "entrenador-personal-20e1f.appspot.com",
      messagingSenderId: "150980917345"
    },
    cliente_endpoint: "cliente",
    instructor_endpoint: "instructor"
  };
  export interface Cliente {
    email: string;
    nombres: string;
    apellidos: string;
    foto:string;
    peso:number;
    altura:number;
    telefono:number;
    genero:boolean;
    fechanac:Timestamp<any>;
    instructor:boolean,
    descorta:string
  }
  
  export interface Instructor {
    message: string;
    pair: string;
    sender: string;
    time: number;
  }