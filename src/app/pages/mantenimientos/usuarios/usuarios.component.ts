import Swal from 'sweetalert2';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Usuario } from '../../../models/usuarios.model';
import { CargarUsuarios } from '../../../interfaces/cargar-usuarios.interface';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;
  public imgSubs: Subscription;

  constructor( public usuarioService: UsuarioService,
               private busquedaService: BusquedasService,
               private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    if ( this.imgSubs !== null ) {
      this.imgSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(500)
      )
      .subscribe( img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( ({ total, usuarios }) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
        });
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios ) {
      this.desde -= valor;
    }
    
    this.cargarUsuarios();
  }

  buscar( termino: string) {
    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedaService.buscar('usuarios', termino)
      .subscribe( (resp: Usuario[]) => {
        this.usuarios = resp;
      });
  }

  eliminarUsuario( usuario: Usuario ) {

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( usuario.uid )
          .subscribe( resp => {
            Swal.fire(
              'Usuario borrado!',
              `${ usuario.nombre } fue elimnado correctamente`,
              'success');
            this.cargarUsuarios();
            });

      }
    });

  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {

      });
  }

  abrirModal( usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
