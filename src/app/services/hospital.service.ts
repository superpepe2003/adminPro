import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

@Injectable({
  providedIn: 'root'
})

export class HospitalService {

  base_url = environment.base_url;

  constructor( private http: HttpClient) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarHospitales() {
    const url = `${ this.base_url }/hospitales`;
    return this.http.get( url, this.headers)
            .pipe(
              map( (resp: {ok: boolean, hospitales: Hospital[]}) =>  resp.hospitales ),
            );
  }

  crearHospital( nombre: string ) {
    const url = `${ this.base_url }/hospitales`;
    return this.http.post( url, { nombre }, this.headers);
  }

  actualizarHospital( nombre: string, _id: string ) {
    const url = `${ this.base_url }/hospitales/${ _id }`;
    return this.http.put( url, { nombre }, this.headers);
  }

  eliminarHospital( _id: string ) {    
    const url = `${ this.base_url }/hospitales/${ _id }`;
    return this.http.delete( url, this.headers);
  }

}
