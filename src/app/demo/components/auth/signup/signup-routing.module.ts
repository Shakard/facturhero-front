import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SignupComponent }
    ])],
    exports: [RouterModule]
})
export class SignupRoutingModule { }
