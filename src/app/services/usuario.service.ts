import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuarios.model';

declare const gapi: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {

      this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        localStorage.setItem('token', resp.token);
        const {email, img = '', google , nombre, role, uid} = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid);
        console.log(this.usuario.imagenUrl);
        return true;
      }),
      catchError( error => of(false) )
    );

  }

  googleInit() {

    return new Promise( resolve => {

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '868238358415-ectetcd1knaf1r0i1nkqglmngrlgf4sa.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  logout() {

    localStorage.removeItem('token');
    console.log(this.auth2);
    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      });
    });

  }


  crearUsuario( formData: RegisterForm ) {

    return this.http.post(`${ base_url }/usuarios`, formData)
              .pipe(
                tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                })
              );

  }

  actualizarUsuario( data: { email: string, nombre: string, role: string } ) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });

  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
              .pipe(
                tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                    console.log( resp );
                })
              );

  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token })
            .pipe(
              tap( (resp: any) => {
                  localStorage.setItem('token', resp.token);
              })
            );

  }

}
