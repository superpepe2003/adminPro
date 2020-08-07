import { Component, Input } from '@angular/core';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: []
})
export class DonaComponent {
  @Input() titulo = 'Sin titulo';
  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label = [ 'label1', 'label2', 'label3'];
  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [ [ 20, 30, 40 ] ];

  public doughnutChartType: ChartType = 'doughnut';

  public colors: Color[] = [
    { backgroundColor: [ '#FF7000', '#FF0000', '#0070FF' ] }
  ];

}
