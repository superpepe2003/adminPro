import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuarios.model';
import { Medico } from '../../models/medicos.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: []
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[];
  public medicos: Medico[];
  public hospitales: Hospital[];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasService: BusquedasService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ termino }) => {
      this.busquedaGlobal( termino );
    });
  }

  busquedaGlobal( termino: string){
    this.busquedasService.busquedaGlobal( termino )
        .subscribe(( resp: any) => {
          this.usuarios = resp.usuarios;
          this.medicos = resp.medicos;
          this.hospitales = resp.hospitales;
        })
  }

}
