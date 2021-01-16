import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medicos.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos() {
    const url = `${ this.base_url }/medicos`;
    return this.http.get( url, this.headers)
            .pipe(
              map( (resp: {ok: boolean, medicos: Medico[]}) =>  resp.medicos ),
            );
  }

  cargarMedicoId( id: string) {
    const url = `${ this.base_url }/medicos/${ id }`;
    return this.http.get( url, this.headers)
            .pipe(
              map( (resp: {ok: boolean, medico: Medico }) =>  resp.medico ),
            );
  }

  crearMedico( medico: Medico ) {
    const url = `${ this.base_url }/medicos`;
    return this.http.post( url, medico, this.headers);
  }

  actualizarMedico( medico: Medico ) {
    const url = `${ this.base_url }/medicos/${ medico._id }`;
    return this.http.put( url, medico, this.headers);
  }

  eliminarMedico( _id: string ) {    
    const url = `${ this.base_url }/medicos/${ _id }`;
    return this.http.delete( url, this.headers);
  }

}
