import { Component, OnInit, Pipe, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando = true;

  imgSub$: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService) { }
               

  ngOnDestroy(): void {
    if( this.imgSub$ ){
      this.imgSub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSub$ = this.modalImagenService.nuevaImagen
      .pipe(
        delay(500)
      )
      .subscribe( img => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
        .subscribe( resp => {
          this.cargando = false;
          this.hospitales = resp;
          this.hospitalesTemp = resp;
        })
  }

  guardarCambios( hospi: Hospital) {
    this.hospitalService.actualizarHospital( hospi.nombre, hospi._id)
        .subscribe( resp =>{
          Swal.fire('Actualizado', hospi.nombre, 'success');
        });
  }

  eliminarHospital( hospi: Hospital) {
    this.hospitalService.eliminarHospital( hospi._id)
        .subscribe( resp =>{
          this.cargarHospitales();
          Swal.fire('Borrado', hospi.nombre, 'success');
        });
  }

  async abrirSweetAlert() {

    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Ingrese Nombre del Hospital'
    });
    
    if( value.length > 0 ) {
      this.hospitalService.crearHospital( value )
          .subscribe( (resp: any) => {
            this.hospitales.push( resp.hospital )
          });
    }

  }

  abrirModal( hospi: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospi._id, hospi.img);
  }

  buscar( termino: string) {
    if ( termino.length === 0 ) {
      return this.hospitales = this.hospitalesTemp;
    }
    this.busquedasService.buscar('hospitales', termino)
      .subscribe( resp => {
        this.hospitales = resp;
      });
  }

}
