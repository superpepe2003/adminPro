import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry()
    // ).subscribe(
    //   valor => console.log('Subs: ', valor),
    //   error => console.warn('Error: ', error),
    //   // tslint:disable-next-line: no-console
    //   () => console.info('obs Terminado!')
    // );

    this.intervalSubs = this.retornaIntervalo()
                          .subscribe( console.log );

  }

  retornaIntervalo() {

    const interval$ = interval( 500 )
                        .pipe(
                          map( valor => valor + 1),
                          filter( resp => (resp % 2 === 0) ? true : false ),
                        );

    return interval$;

  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>( observer => {


      const intervalo = setInterval( () => {

        i++;
        observer.next( i );

        if ( i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }

        if ( i === 2 ) {
          observer.error('i llego al valor de 2');
        }

      }, 1000 );

    });

  }

  ngOnDestroy() {
    if ( this.intervalSubs ) {
      this.intervalSubs.unsubscribe();
    }
  }

}
