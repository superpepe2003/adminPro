import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter, take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo = '';
  public tituloSubs$: Subscription;

  constructor( private router: Router ) {

    this.tituloSubs$ = this.getArgumentosRuta();

  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
        .pipe(
          filter( event => event instanceof ActivationEnd),
          filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
          map( (event: ActivationEnd) => event.snapshot.data)
        )
        .subscribe( ({ titulo }) => {
          this.titulo = titulo;
          document.title = `AdminPro - ${titulo}`;
        });
  }


}
