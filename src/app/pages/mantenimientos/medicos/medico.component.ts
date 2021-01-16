import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medicos.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => this.cargarMedico( id ) );

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    });

    this.medicoForm.get('hospital').valueChanges
        .subscribe( id => {
          this.hospitalSeleccionado = this.hospitales.find( r => r._id === id );
        });
  }

  cargarMedico( id: string ){

    if( id === 'nuevo' ) {
      return;
    }

    this.medicoService.cargarMedicoId( id )
        .pipe( delay(100))
        .subscribe( (medico: any) => {
          console.log(medico);
          if( !medico ) {
            return this.router.navigateByUrl(`/dashboard/medicos`);
          }
          const { nombre, hospital:{_id} } = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre, hospital: _id })
        }, ( err ) => this.router.navigateByUrl('/dashboard/medicos'));
  } 

  cargarHospitales() {

    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.hospitales = hospitales;
        })

  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;
    if( this.medicoSeleccionado ) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( (resp: any) => {
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success')
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
        });
    } else {
      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( (resp: any) => {
            Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
          })
    }
  }

}
