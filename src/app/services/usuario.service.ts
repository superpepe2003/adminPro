import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  guardarLocalStorage( token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, this.headers )
      .pipe(
      map( (resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
        const {email, img = '', google , nombre, role, uid} = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid);
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
        resolve(0);
      });
    });
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('menu');

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
                  this.guardarLocalStorage(resp.token, resp.menu);
                })
              );

  }

  actualizarUsuario( data: { email: string, nombre: string, role: string } ) {

    data = {
       ...data,
       role: this.usuario.role
    };

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers );

  }



  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
              .pipe(
                tap( (resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu);
                })
              );

  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token })
            .pipe(
              tap( (resp: any) => {
                this.guardarLocalStorage(resp.token, resp.menu);
              })
            );

  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuarios>( url, this.headers )
              .pipe(
                map( resp => {
                  const usuarios = resp.usuarios.map(
                    user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                  );

                  return {
                    total: resp.total,
                    usuarios
                  };
                })
              );
  }

  eliminarUsuario( uid ) {

    const url = `${ base_url }/usuarios/${ uid }`;
    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ) {

    // data = {
    //   ...data,
    //   role: this.usuario.role
    // };

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );

  }

}
