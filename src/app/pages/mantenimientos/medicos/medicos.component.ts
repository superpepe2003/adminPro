import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medicos.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit, OnDestroy {

  cargando = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  imgSub$: Subscription;

  constructor( private medicosService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
     if( this.imgSub$ ) {
       this.imgSub$.unsubscribe();
     }
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSub$ = this.modalImagenService.nuevaImagen
                    .pipe( delay( 500 ))
                  .subscribe( resp => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos()
      .subscribe( resp => {
        this.medicos = resp;
        this.medicosTemp = resp;
        this.cargando = false;
    })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

  buscar( termino: string) {
    if ( termino.length === 0 ) {
      return this.medicos = this.medicosTemp;
    }
    this.busquedasService.buscar('medicos', termino)
      .subscribe( resp => {
        this.medicos = resp;
      });
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Borrar Medico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicosService.eliminarMedico( medico._id )
          .subscribe( resp => {
            Swal.fire(
              'Medico borrado!',
              `${ medico.nombre } fue elimnado correctamente`,
              'success');
            this.cargarMedicos();
            });

      }
    });
  }

}
