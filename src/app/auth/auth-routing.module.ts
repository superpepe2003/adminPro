import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const router: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(router)
  ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule { }
