import { Component, OnInit } from '@angular/core';
import { link } from 'fs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {


  constructor( private setting: SettingsService) { }

  ngOnInit(): void {
    this.setting.checkCurrentTheme();
  }

  changeTheme( theme: string ) {

    this.setting.changeTheme( theme );

  }

}
