import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuarios.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medicos.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private transformarUsuarios( resultado: any[] ): Usuario[] {

    return resultado.map(
      user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformarHospitales( resultado: any[] ): Hospital[] {

    return resultado.map(
      hospi => new Hospital( hospi.nombre, hospi.uid, hospi.usuario, hospi.img )
    );
  }

  private transformarMedicos( resultado: any[] ): Medico[] {

    return resultado;
  }

  buscar(
    tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string = ''
    ) {
    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino}`;
    return this.http.get<any[]>( url, this.headers )
        .pipe(
          map( (resp: any) => {
            switch ( tipo ) {
              case 'usuarios':
                return this.transformarUsuarios( resp.resultados );
              case 'hospitales':
                return this.transformarHospitales( resp.resultados );
              case 'medicos':
                return this.transformarMedicos( resp.resultados );

              default:
                return [];
            }
          })
        );
  }

}
