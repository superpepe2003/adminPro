import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuarios.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  public usuario: Usuario;

  constructor( private sideBarService: SidebarService,
               private usuarioService: UsuarioService ) {
    this.menuItems = sideBarService.menu;
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
  }

}
